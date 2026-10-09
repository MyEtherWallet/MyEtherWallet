import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppTextField from '@/components/AppTextField.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: { required: 'Required', clear: 'Clear' } } },
})

// The surface state matrix is covered through AppInput.spec; this only checks
// that AppTextField is wired to the same inputSurfaceClass.
describe('AppTextField — design-library surface (MEW-1971)', () => {
  it('uses the shared input surface for rest and focus', async () => {
    const w = mount(AppTextField, {
      props: { placeholder: 'Message', surface: 'alternative' },
      global: { plugins: [i18n] },
    })
    const textarea = w.get('textarea')
    expect(textarea.classes()).toContain('bg-background-alternative')
    expect(textarea.classes()).toContain('inset-ring-border-default')
    expect(textarea.classes()).toContain('text-text-default')

    await textarea.trigger('focus')
    expect(textarea.classes()).toContain('inset-ring-border-brand')
  })
})
