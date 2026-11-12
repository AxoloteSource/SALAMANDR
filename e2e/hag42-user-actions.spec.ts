import { expect, Page, test } from '@playwright/test'

import { REAL } from './support/credentials'

async function login(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.locator('input[name="email"]').fill(REAL.email)
  await page.locator('input[name="password"]').fill(REAL.password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15000 }).catch(() => undefined)
}

test('HAG: user table shows the user type and hides delete for the current user', async ({ page }) => {
  await login(page)

  const currentUser = await page.evaluate(
    () => JSON.parse(localStorage.getItem('user') || '{}') as { id?: string; email?: string }
  )

  const usersResponse = page.waitForResponse(
    (response) => response.url().includes('/api/v1/users') && response.request().method() === 'GET',
    { timeout: 20000 }
  )

  await page.goto('/auth/users', { waitUntil: 'domcontentloaded' })
  const response = await usersResponse
  expect(response.status(), 'GET /api/v1/users => 206').toBe(206)

  await expect(page.getByText('Tipo de usuario', { exact: true }).first(), 'user type column').toBeVisible({ timeout: 15000 })

  const currentRow = page.locator('tbody tr', { hasText: currentUser.email ?? '' }).first()
  await expect(currentRow, 'current user row').toBeVisible({ timeout: 15000 })
  await expect(currentRow.getByText('Human', { exact: true }).first(), 'current user type').toBeVisible()

  await expect(
    currentRow.getByRole('button', { name: /eliminar|delete/i }),
    'delete action is hidden for the current user'
  ).toHaveCount(0)

  const banButton = currentRow.getByRole('button', { name: /banear|^ban$/i }).first()
  await expect(banButton, 'ban action').toBeVisible()
  await banButton.click()
  await expect(page.locator('.swal2-popup'), 'ban confirmation alert').toBeVisible({ timeout: 10000 })
  await page.locator('.swal2-cancel').click()
  await expect(page.locator('.swal2-popup')).toBeHidden({ timeout: 10000 })
})
