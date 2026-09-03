# Development — Debugging

## Common commands

```bash
npm run lint      # ESLint
npm run typecheck # TypeScript
npm test          # unit tests
npm run build     # production build
```

## "Error: Port XXXX is already in use"

A previous `vite preview` (or dev server) is still running. Either stop it or
let the screenshot script pick a free port (it does by default).

```bash
# find the process
lsof -i :4173
# kill it
kill <pid>
```

## Screenshot capture fails

`npm run capture:screenshots` builds the app, serves it, and drives a headless
Chromium bundled via `@sparticuz/chromium`. If it fails:

1. **"Failed to launch the browser process … libnspr4.so / libnss3.so"**
   The bundled Chromium needs Mozilla's NSS runtime. The script extracts these
   from the npm package's `al2023.tar.br` archive and puts them on
   `LD_LIBRARY_PATH`. If your host already has Chrome/Chromium installed, you
   can instead point the script at your system browser, or just use an
   alternative capture method (see below).
2. **Network blocked:** the script blocks external requests (Google Fonts) so
   navigation can't stall on an unreachable CDN. If the app *needs* external
   resources, remove the `setRequestInterception` block.
3. **Images look wrong** (e.g. the rotation panel isn't visible): the script
   scrolls the target into view before capturing; if a future task is added,
   adjust the scroll/capture step.
4. **"Unknown value for options.waitUntil"** — the script uses Puppeteer's
   `'networkidle0'`. If you swap to Playwright, change it to `'networkidle'`.

### Alternative: manual screenshot (no headless browser)

If you can't run headless Chromium, capture from any browser:

```bash
npm run build
npm run preview        # open http://localhost:4173/Cognizant-Rewards-Platform-ARG/
```

Then use your browser's devtools screenshot, or a system tool (`flameshot`,
`gnome-screenshot`, macOS `Cmd+Shift+4`) on a 1440×900 viewport at
`devicePixelRatio=1`, avoiding browser chrome and localhost UI.

### Alternative: insert a one-off Playwright/Puppeteer script

The generic route is to point any driver at the served URL:

```js
// scripts/manual-shot.mjs (your own one-off)
import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ headless: true })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.goto('http://localhost:4173/Cognizant-Rewards-Platform-ARG/', { waitUntil: 'networkidle0' })
await p.screenshot({ path: 'shot.png' })
await b.close()
```

## React StrictMode double-invocation

In dev, React 19 `<StrictMode>` double-invokes effects and state updaters. If a
reward is applied twice, check that its side effects are guarded (as task 007's
is, via `stareRewardApplied`).

## Lint / `react-hooks/set-state-in-effect`

The original code called `setState` synchronously inside an effect body (the
gaze timer). The fix defers the state writes out of the updater with
`queueMicrotask`. If you reintroduce a synchronous effect `setState`, ESLint
will flag it — read the message, it tells you the rule.

## Lint / `react-hooks/purity`

`Math.random()` inside JSX render is impure. The glitch jitter is stored in
state (`glitchOffset`) and set in the interval effect, so the render stays pure.
Never call `Math.random()` in render.

## TypeScript

The project uses **project references** (`tsconfig.json` → `tsconfig.app.json` +
`tsconfig.node.json`). `npm run typecheck` runs `tsc -b`. If you add a file in
`src/`, it's picked up by `tsconfig.app.json`'s `include: ["src"]`. If you add a
file in `tests/`, ensure `vitest.config.ts`'s `include` matches.

## Deployment / Pages

If the live site 404s or assets fail to load:

1. Confirm the Pages **site is enabled** and set to **Deploy from a branch** via
   **GitHub Actions** (Repo Settings → Pages).
2. Confirm the workflow ran (Actions tab) and the artifact deployed.
3. Make sure `base` in `vite.config.ts` matches the repo path:
   `/Cognizant-Rewards-Platform-ARG/`.
4. Hard-refresh (Ctrl/Cmd+Shift+R) — assets are hashed.
