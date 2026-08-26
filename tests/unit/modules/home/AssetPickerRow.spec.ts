import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import type { AssetPickerItem } from '@/modules/home/composables/useAssetPicker'

// AppTokenLogo/AppTokenSymbol pull the stocks store — stub them.
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/AppTokenSymbol.vue', () => ({
  default: { props: ['symbol'], template: '<span>{{ symbol }}</span>' },
}))

import AssetPickerRow from '@/modules/home/components/AssetPickerRow.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'

const crypto: AssetPickerItem = {
  key: 'crypto-ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  type: 'crypto',
  watchlistId: 'ethereum',
}
const perp: AssetPickerItem = {
  key: 'perp-BTC',
  symbol: 'BTC',
  name: 'Bitcoin',
  type: 'perp',
  watchlistId: 'BTC',
}

const mountRow = (item: AssetPickerItem) => mount(AssetPickerRow, { props: { item } })

describe('AssetPickerRow (MEW-2130)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('reflects the not-listed state and adds to the crypto bucket on click', async () => {
    const store = useWatchlistStore()
    const w = mountRow(crypto)
    expect(w.get('[data-test="picker-star"]').attributes('aria-pressed')).toBe(
      'false',
    )
    await w.get('[data-test="picker-star"]').trigger('click')
    expect(store.watchListedTokens).toEqual(['ethereum'])
    expect(w.get('[data-test="picker-star"]').attributes('aria-pressed')).toBe(
      'true',
    )
  })

  it('toggles off when already listed', async () => {
    const store = useWatchlistStore()
    store.setWatchlistItem('ethereum', false)
    const w = mountRow(crypto)
    expect(w.get('[data-test="picker-star"]').attributes('aria-pressed')).toBe(
      'true',
    )
    await w.get('[data-test="picker-star"]').trigger('click')
    expect(store.watchListedTokens).toEqual([])
  })

  it('routes perps to the perps bucket', async () => {
    const store = useWatchlistStore()
    const w = mountRow(perp)
    await w.get('[data-test="picker-star"]').trigger('click')
    expect(store.watchListedPerps).toEqual(['BTC'])
    expect(store.watchListedTokens).toEqual([])
  })
})
