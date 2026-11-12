import { expect, Page, test } from '@playwright/test'

import { REAL } from './support/credentials'

async function login(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.locator('input[name="email"]').fill(REAL.email)
  await page.locator('input[name="password"]').fill(REAL.password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15000 }).catch(() => undefined)
}

test('HAG: the user form loads human and app user types in a selector', async ({ page }) => {
  await login(page)

  const userTypesResponse = page.waitForResponse(
    (response) => response.url().includes('/api/v1/user-types') && response.request().method() === 'GET',
    { timeout: 20000 }
  )

  await page.goto('/auth/users', { waitUntil: 'domcontentloaded' })
  const response = await userTypesResponse
  expect(response.status(), 'GET /api/v1/user-types => 200').toBe(200)

  await page.getByRole('button', { name: /nuevo|new/i }).click()

  const userTypeLabel = page.locator('label[for="user_type_id"]')
  await expect(userTypeLabel, 'user type selector label').toBeVisible()

  await userTypeLabel.locator('..').locator('.relative').click()
  await expect(page.getByText('App', { exact: true }).first(), 'app option available').toBeVisible({ timeout: 10000 })
  await expect(page.getByText('Human', { exact: true }).first(), 'human option available').toBeVisible({ timeout: 10000 })
})
