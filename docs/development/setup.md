# Development — Setup

## Prerequisites

- **Node.js 18+** (lockfile generated on Node 22; Node 22 recommended).
- **npm** (v10+; v9+ works).

There are **no** system dependencies. This is a pure static front-end. You do
not need a database, a runtime, Docker, or an API key.

## Install

```bash
npm install
```

There are no required environment variables. The only optional ones affect
tooling:

| Var | Applies to | Default |
|-----|------------|---------|
| `CAPTURE_PORT` | `npm run capture:screenshots` | `4173` |

See [`.env.example`](../../.env.example).

## Run

```bash
npm run dev          # Vite dev server with hot reload
```

Open the URL printed in the terminal (default `http://localhost:5173/`).

## Useful commands

```bash
npm run dev                      # dev server
npm run build                    # typecheck + production build → dist/
npm run preview                  # serve dist/ locally (after build)
npm run lint                     # ESLint
npm run typecheck                # tsc -b
npm test                         # Vitest unit tests
npm run capture:screenshots      # real screenshots via headless Chromium
```

## Folder quick-reference

```
src/data/tasks.ts   →  edit the authored fiction (the 20 tasks)
src/lib/            →  pure domain logic + currency registry
src/types.ts        →  shared types
src/App.tsx         →  the view + state
tests/              →  Vitest unit tests
scripts/            →  screenshot capture
docs/               →  documentation
```

## First-time editing tip

If you only want to change **content**, edit `src/data/tasks.ts`. If you want to
change **behaviour**, start in `src/lib/tasks.ts` (status resolution) and
`src/App.tsx` (the view). The domain logic is pure and unit-tested, so you can
verify your change with `npm test`.
