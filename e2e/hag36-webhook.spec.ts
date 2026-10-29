import { expect, Page, test } from '@playwright/test'

import { REAL } from './support/credentials'

async function login(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.locator('input[name="email"]').fill(REAL.email)
  await page.locator('input[name="password"]').fill(REAL.password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15000 }).catch(() => undefined)
}

const collect = (page: Page) => {
  const consoleErrors: string[] = []
  const httpErrors: string[] = []
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR ' + String(e)))
  page.on('response', (r) => r.status() >= 400 && httpErrors.push(`HTTP ${r.status()} ${r.request().method()} ${r.url()}`))
  return { consoleErrors, httpErrors }
}

const URL_PATTERN = /\/api\/v1\/whatsapp\/replicate-urls/

async function gotoWebhook(page: Page) {
  const resp = await Promise.all([
    page.waitForResponse((r) => URL_PATTERN.test(r.url()) && r.request().method() === 'GET', { timeout: 20000 }).catch(() => undefined),
    page.goto('/messages/whatsapp/webhook', { waitUntil: 'domcontentloaded' })
  ]).then((r) => r[0])
  return resp
}

test('HAG-36: /messages/whatsapp/webhook lists replicate URLs, menu entry present, clean console', async ({ page }) => {
  await login(page)
  const { consoleErrors, httpErrors } = collect(page)

  const listResp = await gotoWebhook(page)
  console.log('LIST_STATUS=', listResp?.status())
  expect.soft(listResp?.status(), 'GET replicate-urls => 206').toBe(206)

  const body = await page.locator('#root').innerText()
  console.log('BODY_SNIPPET=', JSON.stringify(body.slice(0, 200)))

  // Table headers rendered (URL / Active / Created At ...).
  await expect.soft(page.getByText('URL', { exact: true }).first(), 'URL column header').toBeVisible()
  await expect.soft(page.getByText('Active', { exact: true }).first(), 'Active column header').toBeVisible()

  // "Webhook" menu item under WhatsApp (available in the sidebar DOM).
  const menuLink = page.locator('a[href="/messages/whatsapp/webhook"]')
  console.log('MENU_WEBHOOK_LINKS=', await menuLink.count())
  expect.soft(await menuLink.count(), 'menu link /messages/whatsapp/webhook').toBeGreaterThan(0)

  console.log('CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('HTTP_ERRORS=', JSON.stringify(httpErrors))
  expect.soft(consoleErrors, 'no console/page errors').toEqual([])
  expect.soft(httpErrors, 'no HTTP >= 400').toEqual([])
})

test('HAG-36: create → edit → toggle → delete round trip hits the real API', async ({ page }) => {
  await login(page)
  const { consoleErrors, httpErrors } = collect(page)
  await gotoWebhook(page)

  const unique = `https://qa-zulia.example.com/hook-${Date.now()}`

  // CREATE (POST 201)
  await page.getByRole('button', { name: /nuevo|new/i }).click()
  await expect(page.locator('input[name="url"]')).toBeVisible({ timeout: 10000 })
  await page.locator('input[name="url"]').fill(unique)
  const [postResp] = await Promise.all([
    page.waitForResponse((r) => URL_PATTERN.test(r.url()) && r.request().method() === 'POST', { timeout: 15000 }),
    page.getByRole('button', { name: /guardar|save/i }).click()
  ])
  console.log('CREATE_STATUS=', postResp.status())
  expect(postResp.status()).toBe(201)
  await expect(page.getByText(unique).first()).toBeVisible({ timeout: 10000 })

  // EDIT (PUT 200)
  const createdRow = page.locator('tr', { hasText: unique }).first()
  await createdRow.getByRole('button', { name: /editar|edit/i }).click()
  await expect(page.locator('input[name="url"]')).toBeVisible({ timeout: 10000 })
  const edited = `${unique}-edited`
  await page.locator('input[name="url"]').fill(edited)
  const [putResp] = await Promise.all([
    page.waitForResponse((r) => URL_PATTERN.test(r.url()) && r.request().method() === 'PUT', { timeout: 15000 }),
    page.getByRole('button', { name: /^(actualizar|update)$/i }).click()
  ])
  console.log('UPDATE_STATUS=', putResp.status())
  expect(putResp.status()).toBe(200)
  await expect(page.getByText(edited).first()).toBeVisible({ timeout: 10000 })

  // TOGGLE (PATCH 200)
  const editedRow = page.locator('tr', { hasText: edited }).first()
  const [patchResp] = await Promise.all([
    page.waitForResponse((r) => /\/toggle/.test(r.url()) && r.request().method() === 'PATCH', { timeout: 15000 }),
    editedRow.getByRole('button', { name: /habilitar|enable/i }).click()
  ])
  console.log('TOGGLE_STATUS=', patchResp.status())
  expect(patchResp.status()).toBe(200)

  // DELETE (DELETE 204) with SweetAlert confirmation.
  const rowToDelete = page.locator('tr', { hasText: edited }).first()
  await rowToDelete.getByRole('button', { name: /eliminar|delete/i }).click()
  const swalConfirm = page.locator('.swal2-confirm')
  await expect(swalConfirm).toBeVisible({ timeout: 10000 })
  const [delResp] = await Promise.all([
    page.waitForResponse((r) => URL_PATTERN.test(r.url()) && r.request().method() === 'DELETE', { timeout: 15000 }),
    swalConfirm.click()
  ])
  console.log('DELETE_STATUS=', delResp.status())
  expect(delResp.status()).toBe(204)
  await expect(page.getByText(edited)).toHaveCount(0, { timeout: 10000 })

  console.log('CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('HTTP_ERRORS=', JSON.stringify(httpErrors))
  expect.soft(consoleErrors, 'no console/page errors').toEqual([])
  expect.soft(httpErrors, 'no HTTP >= 400').toEqual([])
})

test('HAG-36: duplicate URL is rejected (422) and surfaced', async ({ page }) => {
  await login(page)
  await gotoWebhook(page)

  const unique = `https://qa-zulia-dup.example.com/hook-${Date.now()}`

  await page.getByRole('button', { name: /nuevo|new/i }).click()
  await page.locator('input[name="url"]').fill(unique)
  await Promise.all([
    page.waitForResponse((r) => URL_PATTERN.test(r.url()) && r.request().method() === 'POST', { timeout: 15000 }),
    page.getByRole('button', { name: /guardar|save/i }).click()
  ])

  await page.getByRole('button', { name: /nuevo|new/i }).click()
  await expect(page.locator('input[name="url"]')).toBeVisible({ timeout: 10000 })
  await page.locator('input[name="url"]').fill(unique)
  const [dupResp] = await Promise.all([
    page.waitForResponse((r) => URL_PATTERN.test(r.url()) && r.request().method() === 'POST', { timeout: 15000 }),
    page.getByRole('button', { name: /guardar|save/i }).click()
  ])
  console.log('DUPLICATE_STATUS=', dupResp.status())
  expect(dupResp.status()).toBe(422)

  // Clean up the created row to keep the dev DB tidy.
  await page.getByRole('button', { name: /cancelar|cancel/i }).click()
  const row = page.locator('tr', { hasText: unique }).first()
  await row.getByRole('button', { name: /eliminar|delete/i }).click()
  const swalConfirm = page.locator('.swal2-confirm')
  await expect(swalConfirm).toBeVisible({ timeout: 10000 })
  await Promise.all([
    page.waitForResponse((r) => URL_PATTERN.test(r.url()) && r.request().method() === 'DELETE', { timeout: 15000 }),
    swalConfirm.click()
  ])
})
