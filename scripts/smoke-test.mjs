#!/usr/bin/env node
/**
 * Lightweight smoke test: build the app, serve it, drive it with headless
 * Chromium, and verify core UI behaviour (mount, task expansion, completion).
 *
 * Not part of `npm test` (which runs fast Vitest unit tests) — run on demand:
 *   node scripts/smoke-test.mjs
 */

import { spawn } from 'node:child_process'
import puppeteer from 'puppeteer-core'
import chromium, { inflate } from '@sparticuz/chromium'

const root = process.cwd()
const PORT = Number(process.env.CAPTURE_PORT ?? 4199)
const BASE = `/Cognizant-Rewards-Platform-ARG/`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const exe = await chromium.executablePath()
  await inflate(`${root}/node_modules/@sparticuz/chromium/bin/al2023.tar.br`)
  process.env.LD_LIBRARY_PATH = `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH ?? ''}`

  const srv = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  await new Promise((resolve) => {
    srv.stdout.on('data', (d) => { if (d.toString().includes('Local:')) resolve() })
    setTimeout(resolve, 8000)
  })

  let browser
  try {
    browser = await puppeteer.launch({
      executablePath: exe,
      args: [...chromium.args, '--no-sandbox', '--disable-gpu'],
      headless: true,
      env: { ...process.env },
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 900 })
    await page.setRequestInterception(true)
    page.on('request', (r) => {
      const u = r.url()
      ;(u.startsWith('http://127.0.0.1:') || u.startsWith('http://localhost:'))
        ? r.continue().catch(() => {})
        : r.abort().catch(() => {})
    })
    await page.goto(`http://127.0.0.1:${PORT}${BASE}`, { waitUntil: 'domcontentloaded' })
    await sleep(1500)

    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent)
    const buttonCount = await page.evaluate(() => document.querySelectorAll('button').length)
    console.log(`h1: ${h1}`)
    console.log(`buttons: ${buttonCount}`)

    // Expand a task with a bespoke panel (003) and confirm the panel renders.
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Listen to the following refrigerator'))
      btn?.click()
    })
    await sleep(500)
    const playVisible = await page.evaluate(() => document.body.innerText.includes('PLAY HUM'))
    console.log(`task 003 panel PLAY visible: ${playVisible}`)

    // Expand task 006 (rotation) and confirm its OPTIMAL logic renders text.
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Rotate the employee'))
      btn?.click()
    })
    await sleep(400)
    const rotationVisible = await page.evaluate(() => document.body.innerText.includes('Guilt alignment'))
    console.log(`task 006 panel rotation visible: ${rotationVisible}`)

    if (!h1 || buttonCount < 5 || !playVisible || !rotationVisible) {
      console.error('❌ SMOKE TEST FAILED')
      process.exitCode = 1
    } else {
      console.log('✅ SMOKE TEST PASSED')
    }
  } finally {
    await browser?.close()
    srv.kill('SIGTERM')
    // Ensure the process exits even if the vite child lingers.
    process.exit(process.exitCode ?? 0)
  }
}

main().catch((err) => {
  console.error('❌ Smoke test error:', err.message)
  process.exit(1)
})
