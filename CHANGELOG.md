# Changelog

All notable changes to Cognizant Rewards Platform. This project follows
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and since it is a
creative-technology work rather than a packaged library, it does **not** use
SemVer strictly — versions mark meaningful states of the artwork.

Dates are in `YYYY-MM-DD`.

## [1.0.0] - 2026-09-03

### Added

- **Full documentation suite**: rewritten `README.md` (orientation for four
  audiences), a system-level `ARCHITECTURE.md`, and a structured `docs/` tree
  (`technical/`, `design/`, `development/`).
- **Real clickable screenshots** produced from the running app via a new
  `scripts/capture-screenshots.mjs` (using `puppeteer-core` +
  `@sparticuz/chromium`, which bundles its own Chromium so no global browser
  install is needed). Images live in `docs/images/`.
- **GitHub social preview** `docs/images/github-social-preview.png` (1280×640).
- **CI workflow** `.github/workflows/ci.yml` (lint, typecheck, test, build).
- **GitHub Pages deploy workflow** `.github/workflows/deploy-pages.yml`.
- **Issue templates** and a **pull-request template**.
- **Unit tests** for the pure domain logic (`tests/currency.test.ts`,
  `tests/tasks.test.ts`), run via Vitest.
- **Vitest config** and **`.env.example`**.
- **Favicon** (`public/favicon.svg`), replacing the previous 404.

### Changed

- **Refactored `src/App.tsx`** (was ~900 lines) into:
  - `src/types.ts` (shared domain types),
  - `src/data/tasks.ts` (the authored 20-task corpus),
  - `src/lib/currency.ts` (currency registry + valuation),
  - `src/lib/tasks.ts` (pure status resolution + custom-panel registry).
- **Removed** the Arena export harness (`data-arena-recording`,
  `data-arena-views`, `data-element-picker` scripts, and the
  `.vite-source-tags.js` Vite plugin) from `index.html` / `vite.config.ts`.
- **Fixed stale metadata**: package name `placeholder-model-1` →
  `cognizant-rewards-platform`, version `0.0.0` → `1.0.0`, and the leftover
  `"EarnSight™ — Paid Surveys"` `<title>` → the correct brand.
- **Removed unused dependencies** (`lucide-react`, `react-router-dom`).
- **Fixed the Reset Session bug** — it now restores balances and gaze state, not
  just depth and completed tasks.
- **Made the glitch render deterministic** — the horizontal jitter is stored in
  state (`glitchOffset`) instead of calling `Math.random()` during render.
- **Made task 007's gaze effect pure** — the reward + log are deferred out of the
  state updater via `queueMicrotask`, and guarded against double-application.
- **Fixed all 5 pre-existing ESLint errors** (react-hooks/set-state-in-effect,
  react-hooks/purity, ban-ts-comment, no-empty in `vite.config.ts`).
- Set Vite `base` to the GitHub Pages project path.

### Removed

- Empty `src/App.css`.
- `.vite-source-tags.js` (harness) and its `.gitignore` entry.

### Documented / flagged

- **No license file exists** — rights are reserved by default; choosing a
  license is left to the author (see `README.md` and `CONTRIBUTING.md`).
- Task 003's "refrigerator hum" and task 011's "training video" are still
  **authored but not implemented**; the PLAY button and frame counter are
  placeholders. `docs/technical/audio-engine.md` documents the intended
  approach.

[1.0.0]: https://github.com/zazieproductions/Cognizant-Rewards-Platform-ARG/compare/47ee523...HEAD
