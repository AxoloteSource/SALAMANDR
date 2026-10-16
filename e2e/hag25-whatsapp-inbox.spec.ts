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

test('HAG-25: /messages/whatsapp/chats lists inbound contacts (view-only)', async ({ page }) => {
  await login(page)
  const { consoleErrors, httpErrors } = collect(page)

  const contactsResp = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/v1/whatsapp/incoming/contacts'), { timeout: 20000 }).catch(() => undefined),
    page.goto('/messages/whatsapp/chats', { waitUntil: 'domcontentloaded' })
  ]).then((r) => r[0])

  console.log('CONTACTS_STATUS=', contactsResp?.status())
  await page.waitForTimeout(1500)

  const body = await page.locator('#root').innerText()
  console.log('BODY_SNIPPET=', JSON.stringify(body.slice(0, 300)))

  // A seeded contact should appear in the chat panel.
  const seeded = ['Test User', 'María García', '+521234567890', '+529876543210']
  const found = seeded.filter((s) => body.includes(s))
  console.log('SEEDED_FOUND=', JSON.stringify(found))
  expect.soft(found.length, 'at least one seeded contact visible').toBeGreaterThan(0)

  // Read-only: no composer / textarea on the page.
  const textareas = await page.locator('textarea').count()
  console.log('TEXTAREA_COUNT=', textareas)
  expect.soft(textareas, 'no textarea (read-only inbox)').toBe(0)

  console.log('CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('HTTP_ERRORS=', JSON.stringify(httpErrors))
  expect.soft(consoleErrors, 'no console/page errors').toEqual([])
})

test('HAG-25: selecting a contact renders the read-only thread', async ({ page }) => {
  await login(page)
  const { consoleErrors, httpErrors } = collect(page)
  await page.goto('/messages/whatsapp/chats', { waitUntil: 'domcontentloaded' })
  await page.waitForResponse((r) => r.url().includes('/api/v1/whatsapp/incoming/contacts'), { timeout: 20000 }).catch(() => undefined)
  await page.waitForTimeout(1000)

  // Click the first contact entry in the chat list.
  const firstContact = page.getByText(/Test User|María García/).first()
  const hasContact = await firstContact.count()
  console.log('HAS_CONTACT_LINK=', hasContact)
  if (hasContact) {
    const msgResp = page.waitForResponse((r) => r.url().includes('/messages'), { timeout: 15000 }).catch(() => undefined)
    await firstContact.click().catch(() => undefined)
    const resp = await msgResp
    console.log('MESSAGES_STATUS=', resp?.status())
    await page.waitForTimeout(1200)
    const body = await page.locator('#root').innerText()
    console.log('THREAD_SNIPPET=', JSON.stringify(body.slice(0, 300)))
  } else {
    console.log('SKIP: no contact row found to click')
  }

  expect.soft(await page.locator('textarea').count(), 'no textarea (read-only thread)').toBe(0)
  console.log('CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('HTTP_ERRORS=', JSON.stringify(httpErrors))
  expect.soft(consoleErrors, 'no console/page errors').toEqual([])
})
