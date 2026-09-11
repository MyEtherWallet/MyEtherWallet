import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import type { WatchlistRow } from '@/modules/home/composables/useWatchlistRows'

const makeRow = (over: Partial<WatchlistRow> = {}): WatchlistRow => ({
  key: 'token-ethereum',
  symbol: 'ETH',
  name: 'Ethereum',
  isStock: false,
  priceDisplay: '$3,000',
  change: -1.2,
  marketCapDisplay: '$360B',
  volumeDisplay: '$33B',
  sparkline: [3, 2, 1],
  route: { name: 'token-info-home', params: { tokenId: 'ethereum' } },
  tradeSymbol: 'ETH',
  removeType: 'crypto',
  removeId: 'ethereum',
  ...over,
})

const ROWS: WatchlistRow[] = [
  makeRow({
    key: 'stock-AAPL',
    symbol: 'AAPL',
    name: 'Apple',
    isStock: true,
    priceDisplay: '$256.72',
    change: 2.87,
    marketCapDisplay: '$178.43M',
    volumeDisplay: '$9.8M',
    route: { name: 'home-stock-info', params: { symbol: 'AAPL' } },
    tradeSymbol: 'AAPL',
    removeType: 'stock',
    removeId: 'AAPL',
  }),
  makeRow(),
]

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))

// vuedraggable → render the #item slot per element (no real DnD in jsdom).
vi.mock('vuedraggable', () => ({
  default: {
    props: ['modelValue'],
    template:
      '<ul><template v-for="(el,i) in modelValue" :key="el.key"><slot name="item" :element="el" :index="i" /></template></ul>',
  },
}))
// Visual children pull the stocks store / chart.js — stub them.
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/AppTokenSymbol.vue', () => ({
  default: { props: ['symbol'], template: '<span>{{ symbol }}</span>' },
}))
vi.mock('@/components/AppSearchInput.vue', () => ({
  default: {
    props: ['modelValue', 'placeholder', 'bgClass'],
    emits: ['update:modelValue'],
    template:
      '<input data-test="search" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
}))
vi.mock('@/components/TableSparkline.vue', () => ({
  default: { template: '<span data-test="sparkline" />' },
}))
// The add-to-watchlist dialog pulls the asset-picker (perps SDK) — stub it and
// expose its open state.
vi.mock('@/modules/home/components/AddToWatchlistDialog.vue', () => ({
  default: {
    props: ['isOpen'],
    template: '<div data-test="add-dialog" :data-open="isOpen" />',
  },
}))

import HomeWatchlistTable from '@/modules/home/components/HomeWatchlistTable.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const mountTable = (rows: WatchlistRow[] = ROWS) =>
  mount(HomeWatchlistTable, { props: { rows }, global: { plugins: [i18n] } })

describe('HomeWatchlistTable (MEW-2130)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    push.mockClear()
  })

  it('renders one row per provided watchlist row', () => {
    expect(mountTable().findAll('[data-test="watchlist-row"]').length).toBe(2)
  })

  it('star removes the item from the matching store bucket', async () => {
    const store = useWatchlistStore()
    store.setWatchlistItem('AAPL', true)
    store.setWatchlistItem('ethereum', false)
    const w = mountTable()
    const removeButtons = w.findAll('[data-test="watchlist-remove"]')
    await removeButtons[0].trigger('click') // AAPL (stock)
    expect(store.watchListedStocks).toEqual([])
    await removeButtons[1].trigger('click') // ethereum (crypto)
    expect(store.watchListedTokens).toEqual([])
  })

  it('Trade navigates to the row route', async () => {
    const w = mountTable()
    await w.findAll('[data-test="watchlist-trade"]')[0].trigger('click')
    expect(push).toHaveBeenCalledWith({
      name: 'home-stock-info',
      params: { symbol: 'AAPL' },
    })
  })

  it('caps the list at 5 and expands via Show more', async () => {
    const rows = Array.from({ length: 7 }, (_, i) =>
      makeRow({ key: `token-${i}`, symbol: `T${i}`, removeId: `t${i}` }),
    )
    const w = mountTable(rows)
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(5)
    await w.get('[data-test="watchlist-show-more"]').trigger('click')
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(7)
    expect(w.find('[data-test="watchlist-show-more"]').exists()).toBe(false)
  })

  it('filters rows by category (crypto only)', async () => {
    const w = mountTable()
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(2)
    await w.get('[data-test="watchlist-category"]').trigger('click')
    await w
      .get('[data-test="category-option"][data-value="crypto"]')
      .trigger('click')
    const rows = w.findAll('[data-test="watchlist-row"]')
    expect(rows.length).toBe(1) // only ETH (crypto)
  })

  it('filters rows by search query', async () => {
    const w = mountTable()
    await w.get('[data-test="search"]').setValue('apple')
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(1)
  })

  it('renders a loading row as a skeleton (star kept, no trade button)', () => {
    const w = mountTable([
      makeRow({ key: 'token-solana', symbol: '', name: '', loading: true }),
    ])
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(1)
    expect(w.find('[data-test="watchlist-remove"]').exists()).toBe(true)
    expect(w.find('[data-test="watchlist-trade"]').exists()).toBe(false)
  })

  it('Add asset opens the add-to-watchlist dialog on demand', async () => {
    const w = mountTable()
    expect(w.find('[data-test="add-dialog"]').exists()).toBe(false)
    await w.get('[data-test="watchlist-add-new"]').trigger('click')
    expect(w.get('[data-test="add-dialog"]').attributes('data-open')).toBe(
      'true',
    )
    expect(push).not.toHaveBeenCalled()
  })
})
