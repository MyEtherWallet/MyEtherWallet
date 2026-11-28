import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end tests for the Google / email login (MEW-2289).
 *
 * Point E2E_BASE_URL at the environment under test (staging); it defaults to
 * the local dev server. Specs live in `e2e/`, which the unit-test runner
 * ignores.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'https://localhost:8080',
    // The local dev server uses a self-signed certificate.
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
