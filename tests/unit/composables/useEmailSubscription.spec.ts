// tests/unit/composables/useEmailSubscription.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// The composable only needs the toast store / Sentry for subscribeToUpdates;
// the inline-validation path (the MEW-2034 fix) does not, so stub them out and
// exercise the real vue-i18n so locale reactivity is genuinely covered.
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))

import { useEmailSubscription } from '@/composables/useEmailSubscription'

const messages = {
  en: {
    common: {
      subscribe: {
        email_required: 'email required',
        email_invalid: 'Email address is not valid',
      },
    },
  },
  es: {
    common: {
      subscribe: {
        email_required: 'Correo electrónico obligatorio',
        email_invalid: 'La dirección de correo electrónico no es válida',
      },
    },
  },
}

const mountComposable = () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
  })
  let api!: ReturnType<typeof useEmailSubscription>
  const Comp = defineComponent({
    setup() {
      api = useEmailSubscription()
      return () => null
    },
  })
  mount(Comp, { global: { plugins: [i18n] } })
  return { api, i18n }
}

describe('useEmailSubscription (MEW-2034 i18n)', () => {
  it('resolves the empty-email error from the active locale', () => {
    const { api } = mountComposable()
    api.email.value = ''
    api.validateEmail()
    expect(api.isValidEmail.value).toBe(false)
    expect(api.emailErrorMessage.value).toBe('email required')
  })

  it('resolves the invalid-email error from the active locale', () => {
    const { api } = mountComposable()
    api.email.value = 'not-an-email'
    api.validateEmail()
    expect(api.isValidEmail.value).toBe(false)
    expect(api.emailErrorMessage.value).toBe('Email address is not valid')
  })

  it('clears the error for a valid email', () => {
    const { api } = mountComposable()
    api.email.value = 'user@example.com'
    api.validateEmail()
    expect(api.isValidEmail.value).toBe(true)
    expect(api.emailErrorMessage.value).toBeUndefined()
  })

  it('re-translates the already-visible error when the locale changes', async () => {
    const { api, i18n } = mountComposable()
    api.email.value = ''
    api.validateEmail()
    expect(api.emailErrorMessage.value).toBe('email required')
    // Simulate the language dropdown switching locale while the error is shown.
    i18n.global.locale.value = 'es'
    await nextTick()
    expect(api.emailErrorMessage.value).toBe('Correo electrónico obligatorio')
  })

  it('resolves the invalid-email error in the switched locale', async () => {
    const { api, i18n } = mountComposable()
    i18n.global.locale.value = 'es'
    api.email.value = 'nope'
    api.validateEmail()
    await nextTick()
    expect(api.emailErrorMessage.value).toBe(
      'La dirección de correo electrónico no es válida',
    )
  })
})
