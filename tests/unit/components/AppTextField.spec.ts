import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppTextField from '@/components/AppTextField.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: { required: 'Required', clear: 'Clear' } } },
})

const mountField = (props: Record<string, unknown> = {}) =>
  mount(AppTextField, {
    props: { placeholder: 'Message', ...props },
    global: { plugins: [i18n] },
  })

describe('AppTextField feedback row', () => {
  it('renders errorMessage as an error row described by the textarea', () => {
    const w = mountField({ errorMessage: 'Invalid signature' })
    const textarea = w.get('textarea')
    expect(textarea.attributes('aria-invalid')).toBe('true')
    const row = w.get(`[id="${textarea.attributes('aria-describedby')}"]`)
    expect(row.text()).toContain('Invalid signature')
    expect(row.attributes('role')).toBe('alert')
  })

  it('renders a success feedback without flagging the field invalid', () => {
    const w = mountField({
      feedback: { type: 'success', message: 'Signature verified' },
    })
    const textarea = w.get('textarea')
    expect(textarea.attributes('aria-invalid')).toBe('false')
    const row = w.get(`[id="${textarea.attributes('aria-describedby')}"]`)
    expect(row.classes()).toContain('text-text-success')
  })
})
