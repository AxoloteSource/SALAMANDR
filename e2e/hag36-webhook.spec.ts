import { expect, Page, test } from '@playwright/test'

import { REAL } from './support/credentials'

async function login(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.locator('input[name="email"]').fill(REAL.email)
  await page.locator('input[name="password"]').fill(REAL.password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15000 }).catch(() => undefined)
}

test('DEBUG webhook page', async ({ page }) => {
  const errs: string[] = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('response', (r) => r.status() >= 400 && errs.push(`HTTP ${r.status()} ${r.request().method()} ${r.url()}`))

  await login(page)
  const resp = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/v1/whatsapp/replicate-urls'), { timeout: 20000 }).catch(() => undefined),
    page.goto('/messages/whatsapp/webhook', { waitUntil: 'domcontentloaded' })
  ]).then((r) => r[0])
  console.log('RL_URL_STATUS=', resp?.status())
  await page.waitForTimeout(1500)

  console.log('BODY=', JSON.stringify((await page.locator('#root').innerText()).slice(0, 500)))
  console.log('BUTTONS=', JSON.stringify(await page.locator('button').evaluateAll((els) => els.map((e) => ({ t: e.innerText.trim(), a: e.getAttribute('aria-label'), ti: e.getAttribute('title') })).filter((b) => b.t || b.a))))
  console.log('INPUTS=', JSON.stringify(await page.locator('input').evaluateAll((els) => els.map((e) => ({ name: e.getAttribute('name'), ph: e.getAttribute('placeholder'), type: e.getAttribute('type') })))))
  console.log('MENU_HAS_WEBHOOK=', (await page.locator('nav a[href="/messages/whatsapp/webhook"]').count()))
  console.log('ERRS=', JSON.stringify(errs))
  expect(true).toBeTruthy()
})
