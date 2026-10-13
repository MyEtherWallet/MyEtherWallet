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

const mountFeedbackField = (props: Record<string, unknown> = {}) =>
  mount(AppTextArea, {
    props: { placeholder: 'Message', ...props },
    global: { plugins: [i18n] },
  })

describe('AppTextArea feedback row (MEW-2402)', () => {
  it('renders errorMessage as an error row described by the textarea', () => {
    const w = mountFeedbackField({ errorMessage: 'Invalid signature' })
    const textarea = w.get('textarea')
    expect(textarea.attributes('aria-invalid')).toBe('true')
    const row = w.get(`[id="${textarea.attributes('aria-describedby')}"]`)
    expect(row.text()).toContain('Invalid signature')
    expect(row.attributes('role')).toBe('alert')
  })

  it('renders a success feedback without flagging the field invalid', () => {
    const w = mountFeedbackField({
      feedback: { type: 'success', message: 'Signature verified' },
    })
    const textarea = w.get('textarea')
    expect(textarea.attributes('aria-invalid')).toBe('false')
    const row = w.get(`[id="${textarea.attributes('aria-describedby')}"]`)
    expect(row.classes()).toContain('text-text-success')
  })
})
