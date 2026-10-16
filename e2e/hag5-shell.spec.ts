import { expect, Page, test } from '@playwright/test'

type Collected = { consoleErrors: string[]; pageErrors: string[]; failedRequests: string[] }

const goto = (page: Page, path: string) => page.goto(path, { waitUntil: 'domcontentloaded' })

const collect = (page: Page): Collected => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const failedRequests: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', (err) => pageErrors.push(String(err)))
  page.on('requestfailed', (req) => failedRequests.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText ?? ''}`))
  page.on('response', (res) => {
    if (res.status() >= 400) failedRequests.push(`HTTP ${res.status()} ${res.request().method()} ${res.url()}`)
  })

  return { consoleErrors, pageErrors, failedRequests }
}

const dump = (label: string, c: Collected) => {
  if (c.consoleErrors.length || c.pageErrors.length || c.failedRequests.length) {
    console.log(`\n[QA] ${label} findings:`)
    c.consoleErrors.forEach((e) => console.log(`  console.error: ${e}`))
    c.pageErrors.forEach((e) => console.log(`  pageerror: ${e}`))
    c.failedRequests.forEach((e) => console.log(`  request: ${e}`))
  }
}

test.describe('HAG-5 shell', () => {
  let c: Collected

  test.beforeEach(async ({ page }) => {
    c = collect(page)
  })

  test('GET / mounts the SPA (#root populated) and shows home content', async ({ page }) => {
    const resp = await goto(page, '/')
    expect(resp?.status(), 'GET / status').toBeLessThan(400)

    const root = page.locator('#root')
    await expect(root).toBeVisible()
    await expect(root.locator('*').first()).toBeAttached()

    const rendered = await page.locator('#root').innerHTML()
    expect(rendered.length, '#root should be populated after JS').toBeGreaterThan(200)

    await expect(page.getByRole('heading', { level: 1 }).first(), 'home content renders (not stuck on Cargando)').toBeVisible({ timeout: 15000 })
    dump('/ (home)', c)
  })

  test('deep-link + hard refresh: / and /dashboard render the SPA', async ({ page }) => {
    await goto(page, '/dashboard')
    await expect(page.locator('#root')).toBeVisible()
    const dash = await page.locator('#root').innerHTML()
    expect(dash.length, '#root populated on /dashboard deep-link').toBeGreaterThan(200)

    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.locator('#root')).toBeVisible()
    expect((await page.locator('#root').innerHTML()).length, '#root populated after refresh').toBeGreaterThan(200)
    dump('/dashboard deep-link+refresh', c)
  })

  test('/login deep-link renders the login form (email + password + submit)', async ({ page }) => {
    await goto(page, '/login')

    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    await expect(page.locator('label').filter({ hasText: /correo|email/i }).first()).toBeAttached()
    dump('/login', c)
  })

  test('login validation: empty submit keeps the form and shows field errors', async ({ page }) => {
    await goto(page, '/login')
    await expect(page.locator('input[name="email"]')).toBeVisible()

    await page.locator('button[type="submit"]').click()

    // The form must remain mounted (BUG: it collapses to the global "Cargando..." Suspense fallback).
    await expect(page.locator('input[name="email"]'), 'login form remains after submit').toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=/requerid|required|inv[aá]lid|obligatori/i').first()).toBeVisible()
    dump('/login validation', c)
  })

  test('dashboard renders inside the app shell with a populated, navigable menu', async ({ page }) => {
    await goto(page, '/dashboard')

    const sidebar = page.getByRole('navigation').first()
    await expect(sidebar.getByText('Menú')).toBeVisible()

    const home = sidebar.getByRole('link', { name: 'Inicio' })
    const dash = sidebar.getByRole('link', { name: 'Tablero' })
    await expect(home, 'Home (Inicio) menu link').toBeVisible()
    await expect(dash, 'Dashboard (Tablero) menu link').toBeVisible()

    await home.click()
    await expect(page, 'menu navigation works').toHaveURL(/\/$/)
    dump('/dashboard menu', c)
  })

  test('core routes load without console/page errors', async ({ page }) => {
    for (const route of ['/', '/login', '/dashboard']) {
      const col = collect(page)
      await goto(page, route).catch(() => undefined)
      await expect(page.locator('#root')).toBeVisible({ timeout: 15000 })
      dump(route, col)
      expect.soft(col.pageErrors, `pageerrors on ${route}`).toEqual([])
      expect.soft(col.consoleErrors, `console errors on ${route}`).toEqual([])
    }
  })

  test('a11y basics on /login: labelled inputs + named submit', async ({ page }) => {
    await goto(page, '/login')

    for (const name of ['email', 'password']) {
      const input = page.locator(`input[name="${name}"]`)
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const labelledBy = await input.getAttribute('aria-labelledby')
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() : 0
      expect.soft(Boolean(ariaLabel) || Boolean(labelledBy) || hasLabel > 0, `input[${name}] has accessible label`).toBeTruthy()
    }

    const submit = page.locator('button[type="submit"]')
    const submitText = (await submit.innerText()).trim()
    const submitAria = await submit.getAttribute('aria-label')
    expect.soft(Boolean(submitText) || Boolean(submitAria), 'submit button has accessible name').toBeTruthy()

    const h1Count = await page.locator('h1').count()
    expect.soft(h1Count, 'exactly one h1 on login').toBe(1)
  })
})
