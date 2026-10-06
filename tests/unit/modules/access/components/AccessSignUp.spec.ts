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

const { default: AccessSignUp } =
  await import('@/modules/access/components/AccessSignUp.vue')
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
const mountSignUp = () => {
  wrapper = mount(AccessSignUp, {
    attachTo: document.body,
    global: { plugins: [i18n], stubs: { AppAvatar: true } },
  })
  return wrapper
}
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
