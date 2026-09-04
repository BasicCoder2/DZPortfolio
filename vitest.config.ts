import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * Test configuration.
 *
 * `resolve.tsconfigPaths` reuses the `@/` aliases already declared in
 * tsconfig.json, so tests import modules by exactly the specifiers the
 * application uses and the two cannot drift.
 *
 * The environment is `node`, not `jsdom`. What is under test is server logic —
 * authorization, validation, repositories, sanitization — and the markup
 * assertions render through `react-dom/server`, which needs no DOM. Skipping
 * jsdom keeps the suite fast and its failures legible.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // The real `server-only` throws unless resolved under the `react-server`
      // condition, which a plain Node runner cannot provide. See the stub.
      'server-only': fileURLToPath(new URL('./tests/stubs/server-only.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    globals: false,
    restoreMocks: true,
  },
})
