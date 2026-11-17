import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { reactive } from 'vue'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  walletConfigs: {
    enkrypt: { downloadUrls: { browserExtension: 'https://enkrypt.com' } },
  },
}))
const setCurrentView = vi.fn()
const access = reactive({ isBitcoinChain: false, setCurrentView })
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => access,
}))
// The wallet row has its own spec; here it only needs to be present.
vi.mock('@/modules/access/components/SignUpWalletRow.vue', () => ({
  default: {
    name: 'SignUpWalletRow',
    template: '<div data-testid="wallet-row" />',
  },
}))

const { default: configs } = await import('@/configs')
const { default: AccessSignUp } =
  await import('@/modules/access/components/AccessSignUp.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      access_wallet: {
        social: { terms: 'By logging in I agree to the {terms} & {privacy}' },
      },
    },
  },
})

let wrapper: VueWrapper | undefined
const mountSignUp = (props: Record<string, unknown> = {}) => {
  wrapper = mount(AccessSignUp, {
    attachTo: document.body,
    props,
    global: { plugins: [i18n], stubs: { AppAvatar: true } },
  })
  return wrapper
}
beforeEach(() => {
  access.isBitcoinChain = false
})
afterEach(() => wrapper?.unmount())

const continueBtn = (w: VueWrapper) => w.get('[data-testid="email-continue"]')

describe('AccessSignUp', () => {
  it('emits google sign-up', async () => {
    const w = mountSignUp()
    await w.get('[data-testid="google"]').trigger('click')
    expect(w.emitted('sign-up')?.[0]).toEqual([{ method: 'google' }])
  })

  it('enables Continue only for a valid email and emits it trimmed', async () => {
    const w = mountSignUp()
    expect(continueBtn(w).attributes('disabled')).toBeDefined()
    await w.get('input[type="email"]').setValue('  me@mew.com ')
    expect(continueBtn(w).attributes('disabled')).toBeUndefined()
    await continueBtn(w).trigger('click')
    expect(w.emitted('sign-up')?.[0]).toEqual([
      { method: 'email', email: 'me@mew.com' },
    ])
  })

  it('does not emit for an invalid email on Enter', async () => {
    const w = mountSignUp()
    const input = w.get('input[type="email"]')
    await input.setValue('not-an-email')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(w.emitted('sign-up')).toBeUndefined()
  })

  it('links the Terms and the Privacy Policy under the email field', () => {
    const w = mountSignUp()

    expect(w.get('[data-testid="terms-link"]').attributes()).toMatchObject({
      href: configs.TERMS_OF_SERVICE_URL,
      target: '_blank',
      rel: 'noopener noreferrer',
    })
    expect(w.get('[data-testid="privacy-link"]').attributes('href')).toBe(
      'https://www.myetherwallet.com/privacy-policy',
    )
  })

  it('shows why a code could not be sent under the email field', () => {
    const w = mountSignUp({ emailError: 'We could not send a code' })

    expect(w.text()).toContain('We could not send a code')
  })

  it('offers the wallet row next to the Google/email login', () => {
    const w = mountSignUp()

    expect(w.find('[data-testid="wallet-row"]').exists()).toBe(true)
  })

  it('keeps only the wallet row when Bitcoin is selected', () => {
    access.isBitcoinChain = true

    const w = mountSignUp()

    expect(w.find('[data-testid="google"]').exists()).toBe(false)
    expect(w.find('input[type="email"]').exists()).toBe(false)
    expect(w.find('[data-testid="wallet-row"]').exists()).toBe(true)
  })

  it('opens the MEW Mobile download view and links Enkrypt externally', async () => {
    const w = mountSignUp()
    await w.get('[data-testid="download-mew-mobile"]').trigger('click')
    expect(setCurrentView).toHaveBeenCalledWith('download_mobile')
    expect(
      w.get('[data-testid="download-enkrypt"]').attributes(),
    ).toMatchObject({
      href: 'https://enkrypt.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    })
  })
})
