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

describe('AppTextField — design-library surface (MEW-1971)', () => {
  it('maps surface to semantic bg + resting border tokens', () => {
    const def = mountField({ surface: 'default' }).get('textarea').classes()
    expect(def).toContain('bg-background-default')
    expect(def).toContain('text-text-default')

    const alt = mountField({ surface: 'alternative' }).get('textarea').classes()
    expect(alt).toContain('bg-background-alternative')
    expect(alt).toContain('border-border-default')
    expect(alt).not.toContain('ring-inset')
  })

  it('keeps a constant 1px border; focus adds the 2nd px as an inset ring', async () => {
    for (const surface of ['default', 'alternative'] as const) {
      const w = mountField({ surface })
      expect(w.get('textarea').classes()).not.toContain('border-2')
      expect(w.get('textarea').classes()).toContain(
        'hover:inset-ring-border-hover',
      )

      await w.get('textarea').trigger('focus')
      const focus = w.get('textarea').classes()
      expect(focus).not.toContain('border-2')
      expect(focus).toContain('border-border-brand')
      expect(focus).toContain('inset-ring-border-brand')
    }
  })
})
