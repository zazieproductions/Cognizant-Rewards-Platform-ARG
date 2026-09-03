#!/usr/bin/env node
/**
 * Validate that all internal markdown links in the repo resolve to a real file.
 * External (http/https/mailto) links, anchors, and `<...>` targets are skipped.
 *
 *   node scripts/check-links.mjs
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const cwd = process.cwd()
const mdFiles = []

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.chromium-cache'].includes(entry.name)) continue
      walk(p)
    } else if (entry.name.endsWith('.md')) {
      mdFiles.push(p)
    }
  }
}

walk('.')

let dead = 0
for (const f of mdFiles) {
  const content = readFileSync(f, 'utf8')
  const re = /\]\(([^)#]+)(#[^)]*)?\)/g
  let m
  while ((m = re.exec(content))) {
    const target = m[1]
    if (/^https?:/.test(target) || /^mailto:/.test(target) || target.startsWith('<')) continue
    const resolved = path.resolve(path.dirname(f), target)
    if (!existsSync(resolved)) {
      console.log(`DEAD: ${f} -> ${target}`)
      dead++
    }
  }
}

if (dead === 0) {
  console.log(`All internal markdown links resolve ✓ (${mdFiles.length} md files)`)
} else {
  console.error(`${dead} dead link(s) found`)
  process.exit(1)
}
