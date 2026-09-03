#!/usr/bin/env node
/**
 * Capture real screenshots of the running application.
 *
 * This script:
 *   1. builds the project (tsc + vite build),
 *   2. serves the production bundle with `vite preview`,
 *   3. drives the app with a headless Chromium (via `puppeteer-core` +
 *      `@sparticuz/chromium`, which bundles the browser + its runtime libs in
 *      the npm package so no external browser download is required),
 *   4. writes the canonical preview images to docs/images/.
 *
 * Outputs (REAL captures of the working interface, not mockups):
 *   - docs/images/project-preview.png  — the initial dashboard (full viewport)
 *   - docs/images/project-active.png   — a task panel in an interactive state
 *   - docs/images/project-detail.png   — a deep task detail panel
 *
 * Run:
 *   npm run capture:screenshots
 */

import { spawn } from 'node:child_process'
import { mkdir, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import net from 'node:net'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import chromium, { inflate } from '@sparticuz/chromium'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'docs', 'images')
// `vite preview` serves the build under the configured GHP base path.
const BASE = '/Cognizant-Rewards-Platform-ARG/'
const VIEWPORT = { width: 1440, height: 900 }

/** Find a TCP port starting at `start` that is currently free. */
function findFreePort(start = 4173) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const srv = net.createServer()
      srv.unref()
      srv.once('error', () => {
        srv.close()
        tryPort(port + 1)
      })
      srv.once('listening', () => srv.close(() => resolve(port)))
      srv.listen(port, '127.0.0.1')
    }
    tryPort(start)
  })
}

/** Run a child command, streaming output, resolving on exit 0. */
function run(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', ...opts })
    child.on('error', reject)
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`command exited ${code}: ${command} ${args.join(' ')}`)),
    )
  })
}

/** Start the preview server on `port` and return a handle. */
function previewServer(port) {
  const child = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort', '--host', '127.0.0.1'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const wait = new Promise((resolve, reject) => {
    let buf = ''
    const onData = (chunk) => {
      buf += chunk.toString()
      if (buf.includes('Local:')) resolve()
    }
    child.stdout.on('data', onData)
    child.stderr.on('data', (c) => {
      const text = c.toString()
      if (text.includes('error')) reject(new Error(text))
    })
    child.on('exit', (code) => reject(new Error(`preview server exited ${code}`)))
    setTimeout(() => resolve(), 8000)
  })
  return { child, wait }
}

async function capture(page, name, opts = {}) {
  await page.screenshot({ path: path.join(outDir, name), ...opts })
  console.log(`captured docs/images/${name}`)
}

/** Promise-based delay (Puppeteer has no `page.waitForTimeout` helper). */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  // The preview server serves `dist`, so build first if it's missing.
  try {
    await access(path.join(root, 'dist', 'index.html'))
  } catch {
    console.log('no dist/ found — running production build first…')
    await run('npm', ['run', 'build'])
  }

  await mkdir(outDir, { recursive: true })

  // Extract the bundled Chromium and its Amazon-Linux runtime libraries, then
  // place the libs on the loader path so the binary can start in any container.
  // `inflate` unpacks the NSS runtime libs into /tmp/al2023/lib (a fixed lambda
  // path inside @sparticuz/chromium), so we put that on LD_LIBRARY_PATH.
  const exe = await chromium.executablePath()
  await inflate(path.join(root, 'node_modules', '@sparticuz', 'chromium', 'bin', 'al2023.tar.br'))
  const libDir = '/tmp/al2023/lib'
  console.log(`chromium: ${exe}\nlibs: ${libDir}`)

  const port = await findFreePort()
  const BASE_URL = `http://127.0.0.1:${port}${BASE}`
  const server = previewServer(port)
  await server.wait

  // Ensure the loader can find the NSS libs for the child browser process.
  process.env.LD_LIBRARY_PATH = `${libDir}:${process.env.LD_LIBRARY_PATH ?? ''}`

  let browser
  try {
    browser = await puppeteer.launch({
      executablePath: exe,
      // headless shell + software rendering; no GPU needed for a DOM/Canvas app.
      args: [...chromium.args, '--no-sandbox', '--disable-gpu'],
      headless: true,
      env: { ...process.env },
    })

    const page = await browser.newPage()
    await page.setViewport({ width: VIEWPORT.width, height: VIEWPORT.height, deviceScaleFactor: 1 })

    // The app is fully self-contained (no server). Block external requests
    // (Google Fonts, analytics leftovers) so navigation can't stall on an
    // unreachable CDN; fallback system fonts render instead.
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const url = req.url()
      const isLocal = url.startsWith('http://127.0.0.1:') || url.startsWith('http://localhost:')
      if (isLocal) req.continue().catch(() => {})
      else req.abort().catch(() => {})
    })

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await sleep(1800)

    // ---- 1. Project preview: initial dashboard (viewport, ~1440×900) --------
    await capture(page, 'project-preview.png')

    // ---- 2. Project active: open the hallway grid (task 004), toggle cells ---
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Select all hallways'))
      btn?.click()
    })
    await sleep(500)
    for (const label of ['H2', 'H5', 'H11', 'H19']) {
      await page.evaluate((text) => {
        const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === text)
        btn?.click()
      }, label)
    }
    await sleep(400)
    await capture(page, 'project-active.png')

    // ---- 3. Project detail: open the guilt-rotation panel (task 006) --------
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Rotate the employee'))
      btn?.click()
    })
    await sleep(500)
    // Scroll the rotation panel into view so the resolved slider is visible.
    await page.evaluate(() => {
      const taskBtn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Rotate the employee'))
      taskBtn?.scrollIntoView({ block: 'center', behavior: 'instant' })
    })
    await sleep(300)
    // Set the slider near the "optimal" alignment (147°) to show a resolved state.
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]')
      if (slider) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
        setter.call(slider, '147')
        slider.dispatchEvent(new Event('input', { bubbles: true }))
        slider.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
    await sleep(600)
    await capture(page, 'project-detail.png')

    console.log('\nScreenshots written to docs/images/')
  } finally {
    await browser?.close()
    server.child.kill('SIGTERM')
    // Ensure the process exits even if the vite child lingers.
    process.exit(process.exitCode ?? 0)
  }
}

main().catch(async (err) => {
  console.error('\n❌ Screenshot capture failed:', err.message)
  console.error('   See docs/development/debugging.md for troubleshooting.')
  process.exit(1)
})
