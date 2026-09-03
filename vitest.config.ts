import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // The build writes cache/metadata we don't need in tests.
    exclude: ['dist', 'node_modules'],
  },
})
