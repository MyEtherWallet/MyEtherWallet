import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppBanner from '@/components/banner/AppBanner.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIconContainer from '@/components/icon_container/AppIconContainer.vue'
import en from '@/i18n/locales/common/en.json'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })

const mountBanner = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) =>
  mount(AppBanner, {
    props: { description: 'Something happened.', ...props },
    slots,
    global: { plugins: [i18n] },
  })

describe('AppBanner', () => {
  it.each([
    ['info', 'information-circle', 'info', 'status', 'Info'],
    ['alert', 'exclamation-circle', 'error', 'alert', 'Error'],
    ['success', 'check-circle', 'success', 'status', 'Success'],
    ['warning', 'exclamation-triangle', 'warning', 'alert', 'Warning'],
  ] as const)(
    '%s → %s icon, %s tone, role=%s, announced as "%s"',
    (type, icon, tone, role, word) => {
      const w = mountBanner({ type })
      expect(w.getComponent(AppIconContainer).props()).toEqual({ icon, tone })
      expect(w.attributes('role')).toBe(role)
      expect(w.get('.sr-only').text()).toBe(word)
    },
  )

  it('defaults to info and keeps the grey container for every type', () => {
    const w = mountBanner()
    expect(w.attributes('role')).toBe('status')
    expect(w.classes()).toContain('bg-background-default')
  })

  it('turns white for a grey surface', () => {
    const w = mountBanner({ type: 'alert', surface: 'default' })
    expect(w.classes()).toContain('bg-background-alternative')
    expect(w.classes()).not.toContain('bg-background-default')
  })

  it('puts the sr-only type word before the title', () => {
    const w = mountBanner({ type: 'warning', title: 'Low balance' })
    expect(w.text()).toMatch(/^Warning\s*Low balance/)
  })

  it('hides when v-model is false', () => {
    const w = mountBanner({ modelValue: false })
    expect(w.html()).toBe('<!--v-if-->')
  })

  it('hides itself on close and emits update:modelValue + close', async () => {
    const w = mountBanner({ dismissible: true })
    await w.getComponent(AppBtnIcon).trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[false]])
    expect(w.emitted('close')).toHaveLength(1)
    expect(w.find('[role]').exists()).toBe(false)
  })

  it('forwards the title, actions and default slots, and attrs to the root', () => {
    const w = mount(AppBanner, {
      props: { title: 'Network', description: 'unused' },
      attrs: { class: 'mb-4', id: 'net-banner' },
      slots: {
        default: 'Rich <b>copy</b>',
        actions: '<button>Switch</button>',
      },
      global: { plugins: [i18n] },
    })
    expect(w.text()).toContain('Network')
    expect(w.text()).toContain('Rich copy')
    expect(w.get('button').text()).toBe('Switch')
    expect(w.attributes('id')).toBe('net-banner')
    expect(w.classes()).toContain('mb-4')
  })
})
