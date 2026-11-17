import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  walletConfigs: {
    enkrypt: { downloadUrls: { browserExtension: 'https://enkrypt.com' } },
  },
}))
const setCurrentView = vi.fn()
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ setCurrentView }),
}))

const { default: AccessCreateWallet } =
  await import('@/modules/access/components/AccessCreateWallet.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      common: { dont_have_wallet: "Don't have a wallet?" },
      access_wallet: {
        sign_up: {
          cta: 'Sign Up',
          create_options: 'Wallets you can create',
          download_official: 'Download MEW Official wallets',
        },
      },
    },
  },
})

let wrapper: VueWrapper | undefined
const mountRow = (props: Record<string, unknown> = {}) => {
  setCurrentView.mockClear()
  wrapper = mount(AccessCreateWallet, {
    props,
    global: { plugins: [i18n], stubs: { AppAvatar: true } },
  })
  return wrapper
}
afterEach(() => wrapper?.unmount())

const toggle = (w: VueWrapper) => w.get('[data-testid="create-wallet-toggle"]')
const mewMobile = (w: VueWrapper) =>
  w.find('[data-testid="download-mew-mobile"]')
const enkrypt = (w: VueWrapper) => w.find('[data-testid="download-enkrypt"]')

describe('AccessCreateWallet', () => {
  it('asks "Don\'t have a wallet?" with the wallets to create folded away', () => {
    const w = mountRow()

    expect(w.text()).toContain("Don't have a wallet?")
    expect(toggle(w).attributes('aria-expanded')).toBe('false')
    expect(mewMobile(w).exists()).toBe(false)
    expect(enkrypt(w).exists()).toBe(false)
  })

  it('reveals MEW Mobile and Enkrypt when the + is pressed', async () => {
    const w = mountRow()

    await toggle(w).trigger('click')

    expect(toggle(w).attributes('aria-expanded')).toBe('true')
    expect(mewMobile(w).text()).toContain('MEW Mobile')
    expect(enkrypt(w).text()).toContain('Enkrypt')
    expect(enkrypt(w).attributes('href')).toBe('https://enkrypt.com')
    // The row already asks the question, so the list needs no second heading.
    expect(w.text()).not.toContain('Download MEW Official wallets')
  })

  it('folds them away again on a second press', async () => {
    const w = mountRow()

    await toggle(w).trigger('click')
    await toggle(w).trigger('click')

    expect(toggle(w).attributes('aria-expanded')).toBe('false')
    expect(mewMobile(w).exists()).toBe(false)
  })

  it('turns the + into a − while the wallets are showing', async () => {
    const w = mountRow()
    const icon = () =>
      toggle(w).findComponent({ name: 'AppIcon' }).props('name')

    expect(icon()).toBe('plus')
    await toggle(w).trigger('click')
    expect(icon()).toBe('minus')
  })

  it('names the + for screen readers and points it at the list it opens', async () => {
    const w = mountRow()

    expect(toggle(w).attributes('aria-label')).toBe('Wallets you can create')
    await toggle(w).trigger('click')

    const listId = toggle(w).attributes('aria-controls')
    expect(listId).toBeTruthy()
    expect(
      w.get(`#${listId}`).find('[data-testid="download-enkrypt"]').exists(),
    ).toBe(true)
  })

  it('lets the parent hold the open state', async () => {
    const w = mountRow({ expanded: true })
    expect(mewMobile(w).exists()).toBe(true)

    await toggle(w).trigger('click')

    expect(w.emitted('update:expanded')).toEqual([[false]])
  })

  it('opens the MEW Mobile download step from the list', async () => {
    const w = mountRow({ expanded: true })

    await mewMobile(w).trigger('click')

    expect(setCurrentView).toHaveBeenCalledWith('download_mobile')
  })

  it('still offers Sign Up, which opens the Google / email login', async () => {
    const w = mountRow()

    const signUp = w.get('[data-testid="sign-up-cta"]')
    expect(signUp.text()).toBe('Sign Up')
    await signUp.trigger('click')

    expect(setCurrentView).toHaveBeenCalledWith('sign_up')
  })
})
