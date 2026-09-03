import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site: assets are served from
  // https://<owner>.github.io/<repo>/ and must be referenced with this base.
  // Keep in sync with the repo name used by .github/workflows/deploy-pages.yml.
  base: '/Cognizant-Rewards-Platform-ARG/',
  plugins: [react(), tailwindcss()],
})
