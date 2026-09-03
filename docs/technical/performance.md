# Technical — Performance

This is an art piece, not a high-volume web app, but it still has a performance
model worth documenting. It is a single-route SPA with no network data and no
large media, so the budget is comfortable.

## Bundle

Measured on the production build:

| Asset | Size | gzip |
|-------|------|------|
| `index.html` | 1.3 kB | 0.6 kB |
| `index-[hash].js` | ~356 kB | ~113 kB |
| `index-[hash].css` | ~24 kB | ~5 kB |

- One JS chunk, one CSS chunk, one HTML. No lazy loading — the whole piece is
  present on load (appropriate for an artwork that should be fully
  "installed" immediately).
- `framer-motion` is the largest single dependency; it is required for the
  animation system.

## Runtime cost

### Continuous effects

| Effect | Interval | Cost |
|--------|----------|------|
| Pause timer | 1 s | One state write/s; re-renders the (small) tree. |
| Glitch interval | 3 s | ~15% chance of a 150–350 ms full-screen flash. |
| Cursor eye-contact | per `mousemove` | Functional updater `min(c+0.1, 100)`; throttled by browser. |
| Gaze timer (task 007) | 100 ms while hovering | One state write per tick; stops when not hovering. |

### Rendering hotspots

- **`completeTask`** writes four state slices (`completedTasks`, `balances`,
  `logs`, and possibly `depth`), each triggering a re-render. With <20 cards
  this is trivial.
- **Full-tree re-render on every state change.** Because all state lives in one
  component and the task list is not memoized, any change re-renders the entire
  tree. Fine at this scale; would be the first thing to optimise if the corpus
  grew.
- **Glitch overlay** paints a full-screen `repeating-linear-gradient` during its
  brief flash. It is `fixed` + `pointer-events: none`, so it does not affect
  layout or receive pointer events; paint-only.

## Load path

1. Browser fetches `index.html` (base-prefixed for GitHub Pages).
2. It loads the hashed JS + CSS.
3. React 19 mounts `<App/>`.
4. Three effects start. No data fetch, no fonts block rendering (system fallback
   while Google Fonts load; the screenshot capture blocks external requests).

## What is deliberately not optimised

- **No code splitting.** The artwork is one screen; splitting would add a loading
  state to a piece that should feel instantly present.
- **No memoization.** `React.memo` on 20 rows is premature.
- **No asset preloading.** There are no assets (audio/video are not yet
  implemented).

## Suggested optimisations (future)

- Split the task list rows into `React.memo` components so a single state change
  doesn't re-render all 20 cards.
- Extract the currency colors into Tailwind/`@theme` tokens (cosmetic; does not
  change runtime).
- If audio is added, load the `AudioContext` lazily on first gesture (already the
  plan in `audio-engine.md`).
