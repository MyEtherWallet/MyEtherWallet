// tests/unit/composables/useEmailSubscription.spec.ts
import { describe, it, expect, vi } from 'vitest'

// t() echoes the key so we can assert the inline validation messages route
// through vue-i18n instead of emitting hardcoded English (MEW-2034).
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))

import { useEmailSubscription } from '@/composables/useEmailSubscription'

describe('useEmailSubscription (MEW-2034 i18n)', () => {
  describe('validateEmail', () => {
    it('uses the i18n key when the email is empty', () => {
      const { email, validateEmail, isValidEmail, emailErrorMessage } =
        useEmailSubscription()
      email.value = ''
      validateEmail()
      expect(isValidEmail.value).toBe(false)
      expect(emailErrorMessage.value).toBe('common.subscribe.email_required')
    })

    it('uses the i18n key when the email is invalid', () => {
      const { email, validateEmail, isValidEmail, emailErrorMessage } =
        useEmailSubscription()
      email.value = 'not-an-email'
      validateEmail()
      expect(isValidEmail.value).toBe(false)
      expect(emailErrorMessage.value).toBe('common.subscribe.email_invalid')
    })

    it('clears the error for a valid email', () => {
      const { email, validateEmail, isValidEmail, emailErrorMessage } =
        useEmailSubscription()
      email.value = 'user@example.com'
      validateEmail()
      expect(isValidEmail.value).toBe(true)
      expect(emailErrorMessage.value).toBeUndefined()
    })
  })
})
