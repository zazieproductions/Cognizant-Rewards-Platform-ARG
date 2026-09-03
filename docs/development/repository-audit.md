# Repository Audit — Cognizant Rewards Platform

**Date:** 2026-09-03
**Auditor:** Arena.ai Agent Mode (session `arena/01a06540-...`)
**Baseline commit:** `47ee52322146c8f7944a43820cda7629aa1f779d`

This is the internal audit generated *before* any changes were made. It documents
what the repository actually is, what is functional vs. aspirational, and what
needed to change. It is kept on-file as evidence of the reasoning behind the
refactor.

---

## 1. What the project actually is

**Cognizant Rewards Platform** is a single-page, satirical interactive fiction
/ "corporate labor simulator." The user is cast as **Worker 7-443-19**, employee
of a fictional bureaucratic institution, **Mnemonic Solutions** (Est. 1987). The
interface is a dark "hostile dashboard" where the user completes a queue of
surreal, impossible, and emotionally absurd tasks ("Categorize yesterday's
weather using approved emotional terms," "Listen to the refrigerator hum and
determine whether it contains regret," "Stare at the blue square until it
remembers you").

The genre is **immersive critique of productivity & surveillance software**:
rewards, tiers, "emotional labor indexes," corruption levels, compliance memos,
and a "Support Terminal." The aesthetic is damaged / cybernetic-institutional —
monospace type, terminal log feeds, glitch overlays, non-ASCII currency
symbols, and a masked base64 string in the footer.

**Technical reality:**

- **Type:** Vite + React 19 + TypeScript SPA (no router — one screen).
- **State:** `useState` + `useEffect` + `useRef` only. No state library.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (arbitrary-value utility
  classes inline), one `<style>` block for fonts/scrollbars/sliders.
- **Animation:** `framer-motion` (`motion`, `AnimatePresence`, layout).
- **Content:** a hardcoded array of 20 `Task` objects with bespoke per-task
  interactive panels (rotation slider, captcha grid, fridge-hum buttons,
  eye-contact gaze box, frame-number input, final audit).
- **Data:** no fetch, no persistence, no external API. Everything is client-side.

## 2. Functional vs. aspirational

| Area | Status | Note |
|------|--------|------|
| Task list / header / balances | ✅ Functional | Core dashboard renders and updates. |
| Complete-task rewards | ✅ Functional | `completeTask` adds reward, logs, advances depth. |
| Task unlock gates (`depth`) | ✅ Functional | `status` + `corruptionLevel` drive unlocking. |
| Stare-at-square gaze timer | ✅ Functional | Hover-driven timer awards +14 LUNR at 430 units. |
| Glitch overlay | ✅ Functional | Random-interval red scanline flash. |
| Rotation slider (task 006) | ✅ Functional | Constrained by optimal angle 147°/213°. |
| Task 003 "PLAY HUM" | ⚠️ Aspirational | **No audio exists.** Button is decorative; the
|  | | refrigerator hum is *suggested* but not synthesized. |
| Task 011 "training video" | ⚠️ Aspirational | Frame counter is static; no video plays. Timestamp text confirmed. |
| Task 005 captcha / 004 hallways | ✅ Functional | Interactive grids; selection held in state. |
| "COR" reset | ✅ Functional | Resets depth + completed set (balances not reset — minor bug). |
| Persistence across reload | ❌ None | State resets on refresh. |

## 3. Strengths (preserve, do not flatten)

- Original writing voice — the task corpus is genuinely strange and consistent.
- Strong thematic coherence: currency symbols, corruption levels, memos, memos
  from "Bureau of Oneiric Compliance," the base64 footer string.
- Cohesive visual language: near-black ground, monospace body, Inter headings,
  amber/violet/green/red state colors, thin-bordered panels.
- A real, if small, interactive state machine (reward → depth → unlock → status
  mutation).

## 4. Weaknesses / technical debt

1. **Monolithic `src/App.tsx` (903 lines)** mixes content data, types, state,
   effects, and all JSX. No separation of data from presentation.
2. **Stale / placeholder metadata:**
   - `package.json` `name` is `"placeholder-model-1"`, `version` `"0.0.0"`.
   - `index.html` `<title>` is `"EarnSight™ — Paid Surveys"` (a different,
     leftover brand), while the in-app heading is "Cognizant Rewards Platform".
   - `index.html` references `/favicon.svg` but **no `public/` directory, no
     favicon** exists → 404.
3. **Arena "export harness" left in place:** three injected `<script>` blocks
   (`data-arena-recording`, `data-arena-views`, `data-element-picker`) plus a
   `vite.config.ts` plugin (`.vite-source-tags.js`). These call
   `designarena.ai`, `cdn.jsdelivr.net`, expose a generation-id, and are **not**
   part of the artwork. They also break GH Pages content (external beacon) and
   tracking.
4. **Unused dependencies:** `lucide-react` and `react-router-dom` are declared
   but never imported. Dead weight.
5. **Pre-existing ESLint failures (5):**
   - `react-hooks/set-state-in-effect` (stare-timer effect).
   - `react-hooks/purity` — `Math.random()` during render (glitch transform).
   - `@typescript-eslint/ban-ts-comment` + `no-empty` in `vite.config.ts`.
6. **No tests, no CI, no deployment config, no docs** beyond the default Vite
   README (which describes nothing about the project).
7. **No license** — must be reported, never invented.
8. **Reset button bug:** resets depth + completed tasks but not balances or
   `stareCompleted`/`cursorEyeContact`, so a reset leaves an inconsistent state.
9. **`src/App.css` is empty** (dead file). `src/index.css` only has the
   Tailwind import.
10. **Magic numbers everywhere** — `430` (stare target), `147/213` (optimal
    angles), `TARGET`, exchange rates, corruption thresholds.

## 5. Naming & organization

- Repo folder name: `Cognizant-Rewards-Platform-ARG`
- Package name: `placeholder-model-1`
- Single component export: `App`.
- No `src/` subfolders.

## 6. Deployment target

Static SPA. **GitHub Pages** is the correct target (free, no server, no
backend). Requires:
- Vite `base: '/Cognizant-Rewards-Platform-ARG/'` (Pages project site).
- A `_redirects`/routing strategy is moot (single page, no router),
  but Pages needs the SPA to serve at `/`.
- An action to build + upload `dist` to Pages.

## 7. Recommendation

Refactor **conservatively**: extract content/type/helpers into modules, fix the
harness + metadata, add favicon, add full docs (README, ARCHITECTURE, technical/
design/development), add CI + Pages deploy, add real screenshot automation
(Playwright), fix lint + reset bug. **Do not** rewrite the state machine or
remove any written content. Preserve the satirical voice and the "Mnemonic
Solutions" universe.

**Strongest ideas to surface:** the task-corpus as an authored system, the
reward→depth→unlock progression as a state machine, the "hostile dashboard"
concept, and the currency/corruption design language.
