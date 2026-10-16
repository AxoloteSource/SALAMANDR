import { expect, Page, test } from '@playwright/test'

import { REAL } from './support/credentials'

const BAD = { email: 'nobody@example.com', password: 'wrong-pass' }

const AUTH_ITEMS = [
  '/auth/user-lists',
  '/auth/users',
  '/auth/applications',
  '/auth/catalogs/roles',
  '/auth/catalogs/roles/actions',
  '/auth/menus',
  '/auth/ui/pricing-card'
]

const MESSAGES_ITEMS = [
  '/messages/whatsapp-templates',
  '/messages/whatsapp/chats',
  '/messages/whatsapp-info',
  '/messages/emails',
  '/messages/push-notifications',
  '/messages/campaigns',
  '/messages/ui'
]

async function submitCreds(page: Page, email: string, password: string) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.locator('input[name="email"]').fill(email)
  await page.locator('input[name="password"]').fill(password)
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/v1/login'), { timeout: 15000 }),
    page.locator('button[type="submit"]').click()
  ])
  return resp
}

async function realLogin(page: Page) {
  const resp = await submitCreds(page, REAL.email, REAL.password)
  expect.soft(resp.status(), 'POST /api/v1/login status').toBe(200)
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15000 }).catch(() => undefined)
  return resp
}

test.describe('HAG-18 real auth', () => {
  test('real login: 200, redirect to /, token stored', async ({ page }) => {
    const resp = await realLogin(page)
    expect.soft(resp.status()).toBe(200)
    expect.soft(new URL(page.url()).pathname, 'lands on shell').toBe('/')
    const token = await page.evaluate(() => localStorage.getItem('authToken'))
    expect.soft(token, 'authToken persisted').toBeTruthy()
  })

  test('wrong creds: 422 + inline error, stays on /login', async ({ page }) => {
    const resp = await submitCreds(page, BAD.email, BAD.password)
    expect.soft(resp.status(), 'bad creds status').toBe(422)
    await expect.soft(page.locator('text=/invalid|inv[aá]lid|credencial|credentials/i').first(), 'inline error shown').toBeVisible({ timeout: 8000 })
    expect.soft(new URL(page.url()).pathname, 'stays on /login').toBe('/login')
    const token = await page.evaluate(() => localStorage.getItem('authToken'))
    expect.soft(token, 'no token on failure').toBeFalsy()
  })

  test('logout clears session and returns to /login', async ({ page }) => {
    await realLogin(page)
    await expect(page.getByRole('navigation').first()).toBeVisible()

    await page.locator('.dropdown').first().click()
    await page.getByText(/cerrar sesi[oó]n|logout/i).first().click()

    await page.waitForURL((u) => u.pathname.startsWith('/login'), { timeout: 15000 }).catch(() => undefined)
    expect.soft(new URL(page.url()).pathname, 'back on /login').toBe('/login')
    const token = await page.evaluate(() => localStorage.getItem('authToken'))
    expect.soft(token, 'authToken cleared').toBeFalsy()
  })
})

test.describe('HAG-19 live unified menu', () => {
  test('GET /api/v1/menus/salamandr = 200 and sidebar renders the unified menu', async ({ page }) => {
    await realLogin(page)
    const resp = await page.waitForResponse((r) => r.url().includes('/api/v1/menus/salamandr'), { timeout: 15000 }).catch(() => undefined)
    expect.soft(resp?.status(), 'menu endpoint status').toBe(200)

    const sidebar = page.getByRole('navigation').first()
    await expect(sidebar).toBeVisible()

    // Home + every auth/messages item must be reachable from the single menu.
    const expected = ['/', ...AUTH_ITEMS, ...MESSAGES_ITEMS]
    const hrefs = await sidebar.locator('a').evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    const missing = expected.filter((h) => !hrefs.includes(h))
    expect.soft(missing, `menu is missing items: ${missing.join(', ')}`).toEqual([])

    expect.soft(await sidebar.locator('a[href="/"]').count() >= 1, 'home link present').toBeTruthy()
  })

  test('active section auto-opens its menu group; plain pointer click navigates', async ({ page }) => {
    await realLogin(page)
    await page.goto('/auth/users', { waitUntil: 'domcontentloaded' })
    const sidebar = page.getByRole('navigation').first()
    await page.waitForResponse((r) => r.url().includes('/api/v1/menus/salamandr'), { timeout: 15000 }).catch(() => undefined)

    const sibling = sidebar.locator('a[href="/auth/user-lists"]').first()
    await expect(sibling, 'auth group auto-opened (sibling link visible)').toBeVisible({ timeout: 15000 })

    await Promise.all([
      page.waitForURL((u) => new URL(u).pathname === '/auth/user-lists', { timeout: 8000 }),
      sibling.click({ timeout: 8000 })
    ])
    expect.soft(new URL(page.url()).pathname, 'real pointer click navigated').toBe('/auth/user-lists')
  })

  test('every menu item navigates to the right route', async ({ page }) => {
    test.setTimeout(120000)
    await realLogin(page)
    const sidebar = page.getByRole('navigation').first()
    await expect(sidebar).toBeVisible()
    await page.waitForResponse((r) => r.url().includes('/api/v1/menus/salamandr'), { timeout: 15000 }).catch(() => undefined)
    await expect(sidebar.locator('a[href="/auth/users"]'), 'live menu rendered').toBeAttached({ timeout: 15000 }).catch(() => undefined)

    // Groups are collapsible accordions that start closed -> expand the group headers first.
    for (const group of ['Authxolote', 'Catálogos', 'Menús', 'Mensajes', 'WhatsApp', 'Correo', 'Notificaciones push']) {
      await sidebar.getByRole('button', { name: group }).first().click({ timeout: 1500 }).catch(() => undefined)
    }

    for (const route of ['/', ...AUTH_ITEMS, ...MESSAGES_ITEMS]) {
      const link = sidebar.locator(`a[href="${route}"]`).first()
      const present = (await link.count()) > 0
      if (!present) {
        console.log(`MENUCLICK ${route} present=false`)
        expect.soft(false, `menu link for ${route} exists`).toBeTruthy()
        continue
      }

      // Prefer a real pointer click (expand group first); fall back to DOM click if not actionable.
      let method = 'pointer'
      await Promise.all([
        page.waitForURL((u) => new URL(u).pathname === route, { timeout: 4000 }).catch(() => undefined),
        link.click({ timeout: 4000 }).catch(async () => {
          method = 'dom'
          await link.evaluate((el) => (el as HTMLAnchorElement).click()).catch(() => undefined)
        })
      ])
      await page.waitForTimeout(150)
      const landed = new URL(page.url()).pathname
      console.log(`MENUCLICK ${route} present=true method=${method} landed=${landed}`)
      expect.soft(landed, `clicking ${route} navigates there`).toBe(route)
    }
  })
})
