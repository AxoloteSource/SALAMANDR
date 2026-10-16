import { expect, Page, test } from '@playwright/test'

const MESSAGES = [
  '/messages',
  '/messages/whatsapp-templates',
  '/messages/whatsapp-templates/demo-id',
  '/messages/whatsapp-info',
  '/messages/whatsapp/chats',
  '/messages/emails',
  '/messages/push-notifications',
  '/messages/campaigns',
  '/messages/campaigns/demo-id',
  '/messages/ui'
]

const AUTH = [
  '/auth',
  '/auth/users',
  '/auth/user-lists',
  '/auth/applications',
  '/auth/menus',
  '/auth/menus/show',
  '/auth/catalogs/roles',
  '/auth/catalogs/roles/actions',
  '/auth/ui',
  '/auth/ui/pricing-card',
  '/privacy',
  '/termsConditions'
]

const PAGE_ERROR = (page: Page) => {
  const errs: string[] = []
  page.on('pageerror', (e) => errs.push(String(e)))
  return errs
}

async function demoLogin(page: Page) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.locator('input[name="email"]').fill('qa@example.com')
  await page.locator('input[name="password"]').fill('qa-secret')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 8000 }).catch(() => undefined)
}

async function probe(page: Page, route: string) {
  const pageErrors = PAGE_ERROR(page)
  await page.goto(route, { waitUntil: 'domcontentloaded' }).catch(() => undefined)
  await page.waitForTimeout(1200)

  const url = page.url()
  const onLogin = url.includes('/login')
  const rootLen = await page.locator('#root').innerHTML().then((h) => h.length).catch(() => 0)
  const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 120).replace(/\n/g, ' ')
  const stuckCargando = bodyText.trim().startsWith('Cargando')

  console.log(`ROUTE ${route} -> landed=${new URL(url).pathname} onLogin=${onLogin} rootLen=${rootLen} cargando=${stuckCargando} pageErrors=${pageErrors.length}`)
  if (!onLogin) {
    expect.soft(rootLen, `${route} renders content`).toBeGreaterThan(200)
    expect.soft(stuckCargando, `${route} not stuck on Cargando`).toBeFalsy()
    expect.soft(pageErrors, `${route} no page errors`).toEqual([])
  }
  return { route, onLogin, rootLen, stuckCargando }
}

test.describe('HAG-15 public routes (unauthenticated)', () => {
  test('/privacy and /termsConditions render without login redirect', async ({ page }) => {
    for (const r of ['/privacy', '/termsConditions']) {
      const res = await probe(page, r)
      expect.soft(res.onLogin, `${r} should NOT redirect to /login when unauthenticated`).toBeFalsy()
      expect.soft(res.rootLen, `${r} renders content`).toBeGreaterThan(200)
    }
  })
})

test.describe('HAG-15 unified routes (authenticated)', () => {
  test('deep-link every /messages/* route', async ({ page }) => {
    await demoLogin(page)
    console.log('after login url =', page.url())
    for (const r of MESSAGES) await probe(page, r)
  })

  test('deep-link every /auth/* route (+privacy/terms)', async ({ page }) => {
    await demoLogin(page)
    for (const r of AUTH) await probe(page, r)
  })
})
