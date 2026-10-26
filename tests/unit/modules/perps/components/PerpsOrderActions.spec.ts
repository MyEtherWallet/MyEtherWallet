import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import enPerps from '@/i18n/locales/perps/en.json'
import PerpsOrderActions from '@/modules/perps/components/PerpsOrderActions.vue'
import type { ApiOrder } from '@/modules/perps/sdk/types'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: enPerps },
})

const order = (status: ApiOrder['status']) =>
  ({ orderId: '1', status, side: 'buy', market: 'AAA-USD' }) as ApiOrder

const mountActions = (props: {
  order: ApiOrder
  size: 'l' | 'm' | 's'
  cancelling?: boolean
}) =>
  mount(PerpsOrderActions, {
    props: { surface: 'default', ...props },
    global: { plugins: [i18n], directives: { ripple: {} } },
  })

const item = (w: ReturnType<typeof mountActions>, text: string) =>
  w.findAll('li').find(li => li.text() === text)!

describe('PerpsOrderActions', () => {
  it('cancels from a button at L/M', async () => {
    const o = order('open')
    const w = mountActions({ order: o, size: 'm' })
    const button = w.get('button')
    expect(button.text()).toBe('Cancel')
    await button.trigger('click')
    expect(w.emitted('cancel')).toEqual([[o]])
  })

  it('shows the spinner while cancelling', () => {
    const w = mountActions({
      order: order('open'),
      size: 'l',
      cancelling: true,
    })
    expect(w.get('button').attributes('aria-busy')).toBe('true')
  })

  it('views or cancels from the menu at S', async () => {
    const o = order('untriggered')
    const w = mountActions({ order: o, size: 's' })
    await item(w, 'View Order').trigger('click')
    await item(w, 'Cancel Order').trigger('click')
    expect(w.emitted('view')).toEqual([[o]])
    expect(w.emitted('cancel')).toEqual([[o]])
  })

  it('has no actions for an order that is no longer open', () => {
    for (const size of ['l', 's'] as const) {
      const w = mountActions({ order: order('fullyfilled'), size })
      expect(w.find('button').exists()).toBe(false)
    }
  })
})
