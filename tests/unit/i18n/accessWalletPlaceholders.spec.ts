import { describe, it, expect, vi, afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/access_wallet/en.json'
import es from '@/i18n/locales/access_wallet/es.json'
import zh from '@/i18n/locales/access_wallet/zh.json'

// vue-i18n treats a bare "@" as linked-message syntax, so literal emails must be
// escaped as {'@'} or the message fails to compile at runtime.
afterEach(() => vi.restoreAllMocks())

describe('access_wallet literal placeholders', () => {
  it.each([
    ['en', en],
    ['es', es],
    ['zh', zh],
  ])('renders the email placeholder literally in %s', (locale, messages) => {
    const i18n = createI18n({
      legacy: false,
      locale,
      messages: { [locale]: messages },
      missingWarn: false,
      fallbackWarn: false,
    })
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(i18n.global.t('access_wallet.sign_up.email_placeholder')).toBe(
      'you@email.com',
    )
    // A compile failure only surfaces as a console error at runtime.
    expect(error).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })
})
