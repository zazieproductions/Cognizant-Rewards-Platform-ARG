# Security

Cognizant Rewards Platform is a **static client-side React app**. It has no
backend, no database, no authentication, and no network requests of its own (the
only external request is the optional Google Fonts `@import`, which is
non-critical and has system fallbacks). This makes its security surface very
small, but "small" is not "zero."

## What this project is NOT

- It is **not** a real rewards/earnings platform. The currencies, balances,
  "withdrawal threshold," and compliance metrics are all fiction. Nothing is
  stored, transacted, or sent anywhere.
- It is **not** surveillance software. The system feed, "observations," and timer
  messages are authored text shown in the browser. **No telemetry is recorded or
  transmitted.** The piece makes you *feel* watched; it does not watch.

> A note on the original scaffold: the repo previously shipped Arena/
> DesignArena tracking scripts in `index.html` (`data-arena-recording`,
> `data-arena-views`) and a `data-element-picker`, plus a `.vite-source-tags.js`
> build plugin that injected source locations into the DOM. These have been
> **removed** as part of this refactor because they are not part of the artwork
> and they made network calls to third parties. See
> `docs/development/repository-audit.md`.

## Known security posture

- **No server-side surface.** Nothing to authenticate, no secrets to leak.
- **No user input is processed by a server.** The only inputs are local
  React state (buttons, sliders, text fields). There is no SQL/NoSQL, no
  command execution, no file upload.
- **Third-party fonts** load from Google Fonts. If you require zero third-party
  communication (e.g. for an offline installation or a privacy-sensitive
  deployment), remove the `@import` from `App.tsx` and rely on the system
  monospace fallbacks.
- **Dependencies** are the usual Vite/React toolchain. `npm audit` reports a
  handful of transitive advisories; review them as you would for any front-end.
  They do not affect the runtime behaviour of the artwork.

## Reporting a vulnerability

Because there is no backend and no user data, the practical impact of a
"vulnerability" here is limited to (a) a client-side bug that breaks the piece,
or (b) a supply-chain issue in the dependency tree. If you find either, please
open a **private** issue via GitHub's security advisory flow, or contact the
maintainers directly, rather than posting exploit details publicly.

Please include:

- A description of the issue.
- Steps to reproduce (with browser/version).
- Impact (does it break the fiction? leak anything? allow injection into the DOM?).
- Any suggested fix.

## General safe-deployment notes

- Serve over **HTTPS** (any modern static host does this).
- Review your **dependency lockfile** (`package-lock.json`) before deploying.
- Use a recent Node LTS to build.
- The deploy workflow runs `npm ci` (clean install), so the lockfile is
  authoritative.
