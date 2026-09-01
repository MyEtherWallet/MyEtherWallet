import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import type { WatchlistRow } from '@/modules/home/composables/useWatchlistRows'

const ROWS: WatchlistRow[] = [
  {
    key: 'stock-AAPL',
    symbol: 'AAPL',
    name: 'Apple',
    isStock: true,
    priceDisplay: '$256.72',
    change: 2.87,
    marketValueDisplay: '$178.43M',
    sparkline: [1, 2, 3],
    route: { name: 'home-stock-info', params: { symbol: 'AAPL' } },
    tradeSymbol: 'AAPL',
    removeType: 'stock',
    removeId: 'AAPL',
  },
  {
    key: 'token-ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    isStock: false,
    priceDisplay: '$3,000',
    change: -1.2,
    marketValueDisplay: '$360B',
    sparkline: [3, 2, 1],
    route: { name: 'token-info-home', params: { tokenId: 'ethereum' } },
    tradeSymbol: 'ETH',
    removeType: 'crypto',
    removeId: 'ethereum',
  },
]

const push = vi.fn()
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }))

// Visual children pull the stocks store / chart.js — stub them.
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/AppTokenSymbol.vue', () => ({
  default: { props: ['symbol'], template: '<span>{{ symbol }}</span>' },
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

  it('renders a loading row as a skeleton (star kept, no trade button)', () => {
    const loadingRow: WatchlistRow = {
      key: 'token-solana',
      symbol: '',
      name: '',
      isStock: false,
      priceDisplay: '',
      change: 0,
      marketValueDisplay: '',
      sparkline: [],
      route: { name: 'token-info-home', params: { tokenId: 'solana' } },
      tradeSymbol: 'solana',
      removeType: 'crypto',
      removeId: 'solana',
      loading: true,
    }
    const w = mountTable([loadingRow])
    // The row is present and its star (remove) still works, but the trade
    // button is replaced by a skeleton until data loads.
    expect(w.findAll('[data-test="watchlist-row"]').length).toBe(1)
    expect(w.find('[data-test="watchlist-remove"]').exists()).toBe(true)
    expect(w.find('[data-test="watchlist-trade"]').exists()).toBe(false)
  })

  it('Add new asset opens the add-to-watchlist dialog on demand', async () => {
    const w = mountTable()
    // Dialog is mounted only when opened (v-if), so it starts absent.
    expect(w.find('[data-test="add-dialog"]').exists()).toBe(false)
    await w.get('[data-test="watchlist-add-new"]').trigger('click')
    expect(w.get('[data-test="add-dialog"]').attributes('data-open')).toBe(
      'true',
    )
    expect(push).not.toHaveBeenCalled()
  })
})
