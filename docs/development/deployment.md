# Development — Deployment

Cognizant Rewards Platform is a **static single-page app**. There is no
server, so it deploys to any static host. The configured target is **GitHub
Pages**.

## GitHub Pages (the intended production host)

The workflow is
[`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml).

### One-time setup (repo owner)

1. Go to **Repository → Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Save.

> The automation token used in this session cannot enable the Pages site, so
> this is the one manual step. After it's done, deployment is fully automatic.

### How it deploys

The workflow triggers on **every push to `main`** and on manual
`workflow_dispatch`. It:

1. Checks out the repo.
2. Sets up Node 22 with npm caching.
3. Runs `npm ci`.
4. Runs `npm run build` (→ `dist/`).
5. Uploads `dist/` as a Pages artifact.
6. Deploys the artifact.

### Resulting URL

```
https://zazieproductions.github.io/Cognizant-Rewards-Platform-ARG/
```

Because `vite.config.ts` sets `base: '/Cognizant-Rewards-Platform-ARG/'`, all
asset URLs are already base-prefixed. The app has no router, so there's no
client-side routing and no need for a `_redirects`/404 rule.

## Verifying a deployment

- Load the URL; the dashboard should render (not a 404).
- Open DevTools → Network; confirm assets load from
  `/Cognizant-Rewards-Platform-ARG/assets/...` (not `/assets/...`).
- Confirm the favicon loads (`/Cognizant-Rewards-Platform-ARG/favicon.svg`).
- Hard-refresh once to bust any cached hashed asset.

## Other hosts (Vercel / Netlify / Cloudflare Pages)

Any static host works. Minimal config:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | 18+ (20+ recommended) |

Set `base` in `vite.config.ts` to match your host's serving path (often `'/'`).

## Not needed

- No environment variables / secrets for the app itself.
- No database.
- No server-side rendering.
- No redirect rules (single page).

## The automation caveat

The deploy workflow **must** run on `main`. This session pushes to the
`arena/01a06540-cognizant-rewards-platform-arg` branch; the Pages deployment
will only activate once the work is merged to `main` **and** Pages is enabled
in repo settings.
