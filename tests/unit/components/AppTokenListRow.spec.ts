import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTokenListRow from '@/components/AppTokenListRow.vue'

// AppTokenLogo / AppTokenSymbol pull in stocksStore (Pinia) internally, which
// is irrelevant to this row's mapping. Stub them; AppTokenSymbol still renders
// the symbol text so we can assert on it.
const stubs = {
  AppTokenLogo: true,
  AppTokenSymbol: {
    props: ['symbol'],
    template: '<span>{{ symbol }}</span>',
  },
}

const mountRow = (props: Record<string, unknown>) =>
  mount(AppTokenListRow, { props, global: { stubs } })

describe('AppTokenListRow (MEW-2094)', () => {
  it('renders symbol, name and formatted price', () => {
    const w = mountRow({
      symbol: 'BTC',
      name: 'Bitcoin',
      priceDisplay: '$72.68',
      change: 11.37,
    })
    expect(w.text()).toContain('BTC')
    expect(w.text()).toContain('Bitcoin')
    expect(w.text()).toContain('$72.68')
  })

  it('renders a positive change in success color with a + sign, no arrow', () => {
    const change = mountRow({ symbol: 'BTC', change: 11.37 }).get(
      '[data-test="token-list-row-change"]',
    )
    expect(change.classes()).toContain('text-success')
    expect(change.text()).toBe('+11.37%')
  })

  it('renders a negative change in error color with a - sign', () => {
    const change = mountRow({ symbol: 'USDT', change: -1.65 }).get(
      '[data-test="token-list-row-change"]',
    )
    expect(change.classes()).toContain('text-error')
    expect(change.text()).toBe('-1.65%')
  })

  it('omits the change line when change is undefined', () => {
    const w = mountRow({ symbol: 'BTC', priceDisplay: '$1.00' })
    expect(w.find('[data-test="token-list-row-change"]').exists()).toBe(false)
  })

  it('emits select on click', async () => {
    const w = mountRow({ symbol: 'BTC', change: 1 })
    await w.get('[data-test="token-list-row"]').trigger('click')
    expect(w.emitted('select')).toHaveLength(1)
  })
})
