import { expect, test, type Page } from '@playwright/test'

/**
 * Email login with Privy's test account (MEW-2289).
 *
 * Needs the credentials from the Privy dashboard (User management >
 * Authentication > Advanced > Enable test accounts):
 *   PRIVY_TEST_EMAIL=test-XXXX@privy.io PRIVY_TEST_OTP=XXXXXX pnpm test:e2e:playwright
 * Without them every test here is skipped.
 */
const email = process.env.PRIVY_TEST_EMAIL
const otp = process.env.PRIVY_TEST_OTP

const privyKeys = (page: Page) =>
  page.evaluate(() => ({
    session: Object.keys(sessionStorage).filter(key =>
      key.startsWith('privy:'),
    ),
    local: Object.keys(localStorage).filter(key =>
      key.toLowerCase().includes('privy'),
    ),
    cookies: document.cookie,
  }))

const hasLoginToken = (keys: string[]): boolean =>
  keys.some(key => key.includes('token'))

const logIn = async (page: Page): Promise<void> => {
  await page.goto('/access?type=sign_up')
  await page.locator('input[type="email"]').fill(email ?? '')
  await page.getByTestId('email-continue').click()
  await page.locator('input[autocomplete="one-time-code"]').first().click()
  await page.keyboard.type(otp ?? '')
  // A first login sets up the wallet and asks the opt-in; later ones finish
  // on their own. Either way the modal ends up closed.
  const createOnly = page.getByTestId('create-account-only')
  const modal = page.locator('.app-modal-panel')
  await expect(async () => {
    if (await createOnly.isVisible()) await createOnly.click()
    await expect(modal).toBeHidden({ timeout: 1_000 })
  }).toPass({ timeout: 90_000 })
}

test.describe('Privy email login', () => {
  test.skip(
    !email || !otp,
    'Set PRIVY_TEST_EMAIL and PRIVY_TEST_OTP to the Privy dashboard test account',
  )

  test('logs in and keeps the login in this tab only', async ({ page }) => {
    await logIn(page)

    const stored = await privyKeys(page)
    expect(hasLoginToken(stored.session)).toBe(true)
    expect(stored.local).toEqual([])
    expect(stored.cookies).not.toContain('privy')
  })

  test('keeps the login in the tab across a reload and offers to continue with it', async ({
    page,
  }) => {
    await logIn(page)

    // A fresh page load: the wallet is watch-only again, but the login is
    // still in this tab and is offered, never reused on its own.
    await page.goto('/access?type=sign_up')

    expect(hasLoginToken((await privyKeys(page)).session)).toBe(true)
    await expect(page.getByTestId('continue-as')).toBeVisible()
  })

  test('does not log out the first tab when a second one opens', async ({
    page,
    context,
  }) => {
    await logIn(page)

    const second = await context.newPage()
    await second.goto('/')
    await second.waitForLoadState('networkidle')

    expect(hasLoginToken((await privyKeys(page)).session)).toBe(true)
    expect(hasLoginToken((await privyKeys(second)).session)).toBe(false)
  })
})
