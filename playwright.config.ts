import { defineConfig, devices } from '@playwright/test'

/**
 * Minimal Playwright config for Zulia's live client checks (HAG-5 / HAG-15).
 * Tests live in `e2e/` (owned by Zulia). No `webServer` block: Laravel Herd
 * already serves the app at http://SALAMANDR.test.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://SALAMANDR.test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
