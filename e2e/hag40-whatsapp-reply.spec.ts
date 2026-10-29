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

const CONTACTS_PATTERN = /\/api\/v1\/whatsapp\/incoming\/contacts/
const THREAD_PATTERN = /\/api\/v1\/whatsapp\/incoming\/contacts\/\d+\/messages/
const SEND_PATTERN = /\/api\/v1\/whatsapp\/send-text/

async function openThread(page: Page) {
  await Promise.all([
    page.waitForResponse((r) => CONTACTS_PATTERN.test(r.url()) && r.request().method() === 'GET', { timeout: 20000 }).catch(() => undefined),
    page.goto('/messages/whatsapp/chats', { waitUntil: 'domcontentloaded' })
  ])
  await page.waitForTimeout(1500)

  const panel = page.locator('div.panel').first()
  let firstChat = panel.getByRole('button', { name: /Test User|María García|Ozuna/i }).first()
  if ((await firstChat.count()) === 0) {
    firstChat = panel.getByRole('button').nth(1)
  }
  await expect(firstChat).toBeVisible({ timeout: 15000 })
  await Promise.all([
    page.waitForResponse((r) => THREAD_PATTERN.test(r.url()), { timeout: 15000 }).catch(() => undefined),
    firstChat.click()
  ])
  await page.waitForTimeout(1000)
}

test('HAG-40: the WhatsApp thread exposes a reply composer (no longer read-only)', async ({ page }) => {
  await login(page)
  const { consoleErrors, httpErrors } = collect(page)

  await openThread(page)

  const textarea = page.locator('textarea[name="message"]')
  await expect.soft(textarea, 'composer textarea present').toBeVisible({ timeout: 10000 })
  console.log('TEXTAREA_COUNT=', await textarea.count())

  console.log('CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('HTTP_ERRORS=', JSON.stringify(httpErrors))
  expect.soft(consoleErrors, 'no console/page errors').toEqual([])
})

test('HAG-40: sending a free-text reply POSTs /send-text and shows it in the thread', async ({ page }) => {
  await login(page)
  const { consoleErrors, httpErrors } = collect(page)

  await openThread(page)

  const textarea = page.locator('textarea[name="message"]')
  await expect(textarea).toBeVisible({ timeout: 10000 })

  const text = `QA Diego HAG-40 ${Date.now()}`
  await textarea.fill(text)

  const [sendResp] = await Promise.all([
    page.waitForResponse((r) => SEND_PATTERN.test(r.url()) && r.request().method() === 'POST', { timeout: 15000 }),
    textarea.press('Enter')
  ])
  console.log('SEND_STATUS=', sendResp.status())
  expect(sendResp.status(), 'POST /whatsapp/send-text => 201').toBe(201)

  // The sent message appears in the conversation exactly once (no optimistic duplicate).
  await expect(page.getByText(text)).toBeVisible({ timeout: 10000 })
  const occurrences = await page.getByText(text).count()
  console.log('OCCURRENCES=', occurrences)
  expect.soft(occurrences, 'no duplicated bubble after refetch').toBe(1)

  console.log('CONSOLE_ERRORS=', JSON.stringify(consoleErrors))
  console.log('HTTP_ERRORS=', JSON.stringify(httpErrors))
  expect.soft(consoleErrors, 'no console/page errors').toEqual([])
  expect.soft(httpErrors, 'no HTTP >= 400').toEqual([])
})
