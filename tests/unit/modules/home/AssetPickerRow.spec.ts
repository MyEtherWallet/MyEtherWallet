import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { AssetPickerItem } from '@/modules/home/composables/useAssetPicker'

// AppTokenLogo/AppTokenSymbol pull the stocks store — stub them.
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/AppTokenSymbol.vue', () => ({
  default: { props: ['symbol'], template: '<span>{{ symbol }}</span>' },
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    formatFiat: (value: number) => ({ display: `$${value}` }),
  }),
}))

import AssetPickerRow from '@/modules/home/components/AssetPickerRow.vue'

const item: AssetPickerItem = {
  key: 'crypto-ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  type: 'crypto',
  watchlistId: 'ethereum',
  price: 2500,
  change: 3.5,
}

const mountRow = (props: { item?: AssetPickerItem; selected?: boolean }) =>
  mount(AssetPickerRow, { props: { item, selected: false, ...props } })

describe('AssetPickerRow', () => {
  it('is a toggle button that reflects the selected state', () => {
    const off = mountRow({ selected: false }).get(
      '[data-test="asset-picker-row"]',
    )
    expect(off.element.tagName).toBe('BUTTON')
    expect(off.attributes('aria-pressed')).toBe('false')
    const on = mountRow({ selected: true }).get(
      '[data-test="asset-picker-row"]',
    )
    expect(on.attributes('aria-pressed')).toBe('true')
  })

  it('renders the star before the logo, filled only when selected', () => {
    const w = mountRow({ selected: true })
    const star = w.get('[data-test="picker-star"]')
    expect(star.classes()).toContain('text-text-brand')
    expect(
      mountRow({ selected: false }).get('[data-test="picker-star"]').classes(),
    ).toContain('text-text-placeholder')
    const row = w.get('[data-test="asset-picker-row"]').element
    expect(row.firstElementChild).toBe(star.element)
  })

  it('emits toggle when the row is clicked', async () => {
    const w = mountRow({})
    await w.get('[data-test="asset-picker-row"]').trigger('click')
    expect(w.emitted('toggle')).toHaveLength(1)
  })

  it('shows the price and a signed 24h change coloured by direction', () => {
    const up = mountRow({})
    expect(up.get('[data-test="picker-price"]').text()).toBe('$2500')
    const upChange = up.get('[data-test="picker-change"]')
    expect(upChange.text()).toBe('+3.50%')
    expect(upChange.classes()).toContain('text-text-success')

    const down = mountRow({ item: { ...item, change: -1.25 } })
    const downChange = down.get('[data-test="picker-change"]')
    expect(downChange.text()).toBe('-1.25%')
    expect(downChange.classes()).toContain('text-text-error')
  })

  it('omits price and change when the API has none', () => {
    const w = mountRow({
      item: { ...item, price: undefined, change: undefined },
    })
    expect(w.find('[data-test="picker-price"]').exists()).toBe(false)
    expect(w.find('[data-test="picker-change"]').exists()).toBe(false)
  })
})
