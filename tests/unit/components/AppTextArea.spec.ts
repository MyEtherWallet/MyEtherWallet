import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppTextArea from '@/components/AppTextArea.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: { required: 'Required', clear: 'Clear' } } },
})

// The surface state matrix is covered through AppInput.spec; this only checks
// that AppTextArea is wired to the same inputSurfaceClass.
describe('AppTextArea — design-library surface (MEW-1971)', () => {
  it('uses the shared input surface for rest and focus', async () => {
    const w = mount(AppTextArea, {
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

describe('AppTextArea — typing state (MEW-1971)', () => {
  it('drops the focus ring while typing (Figma Active)', async () => {
    const w = mount(AppTextArea, {
      props: { placeholder: 'Message' },
      global: { plugins: [i18n] },
    })
    const textarea = w.get('textarea')
    await textarea.trigger('focus')
    expect(textarea.classes()).toContain('inset-ring-border-brand')
    await textarea.trigger('input')
    expect(textarea.classes()).not.toContain('inset-ring-border-brand')
  })
})
