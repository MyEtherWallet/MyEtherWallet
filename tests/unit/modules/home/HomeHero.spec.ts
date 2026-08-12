import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

// stocksStore is consumed via storeToRefs → mock as a real Pinia setup store.
vi.mock('@/stores/stocksStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  const stock = (symbol: string) => ({
    primaryMarket: { symbol, price: '10', priceChangePercentage24h: '1.5' },
    underlyingMarket: { name: `${symbol} Inc` },
    iconPngUrl: undefined,
    iconSvgUrl: undefined,
  })
  return {
    useStocksStore: defineStore('stocks', () => ({
      // 6 items -> Hero must slice to 5.
      trending: r(['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'META'].map(stock)),
      isLoadingOverview: r(false),
    })),
  }
})

const cryptoTrending = ref([
  {
    coinId: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 60000,
    priceChangePercentage24h: 2.1,
    logoUrl: null,
    ondo: null,
  },
  {
    coinId: 'eth',
    symbol: 'ETH',
    name: 'Ether',
    price: 3000,
    priceChangePercentage24h: -1.2,
    logoUrl: null,
    ondo: null,
  },
])
const fetchTrending = vi.fn()
vi.mock('@/modules/home/composables/useCryptoTrending', () => ({
  useCryptoTrending: () => ({
    trending: cryptoTrending,
    fetchTrending,
    isLoading: ref(false),
  }),
}))

// Both child components transitively import walletStore/DepositDialog (Ledger
// SDK), unavailable under jsdom. Replace their modules with inert stubs — this
// section's job is only the data mapping + layout wiring.
vi.mock('@/modules/home/components/HeroPortfolioCard.vue', () => ({
  default: { template: '<div data-test="portfolio-card" />' },
}))
vi.mock('@/modules/home/components/HeroTrendingCard.vue', () => ({
  default: {
    props: ['title', 'seeAllTo', 'items', 'isLoading'],
    template:
      '<div data-test="trending" :data-count="items.length">{{ title }}</div>',
  },
}))
vi.mock('@/modules/home/components/HeroBanner.vue', () => ({
  default: { template: '<div data-test="hero-banner" />' },
}))
vi.mock('@/modules/home/components/HeroWatchlistBanner.vue', () => ({
  default: {
    emits: ['begin'],
    template:
      '<button data-test="hero-watchlist-banner" @click="$emit(\'begin\')" />',
  },
}))
vi.mock('@/modules/home/components/HomeWatchlistTable.vue', () => ({
  default: {
    props: ['rows'],
    template: '<div data-test="home-watchlist-table" />',
  },
}))

// useWatchlistRows pulls the perps SDK / currency store — mock it with
// controllable refs so the gate (table vs banner) can be exercised.
const watchlistRows = ref<unknown[]>([])
const isLoadingWatchlist = ref(false)
const refreshWatchlist = vi.fn()
vi.mock('@/modules/home/composables/useWatchlistRows', () => ({
  useWatchlistRows: () => ({
    rows: watchlistRows,
    isLoading: isLoadingWatchlist,
    refresh: refreshWatchlist,
  }),
}))
vi.mock('@/modules/home/components/HomeWatchlistOnboardingDialog.vue', () => ({
  default: {
    props: ['isOpen'],
    template: '<div data-test="onboarding-dialog" :data-open="isOpen" />',
  },
}))

// watchlistTableStore is consumed via storeToRefs → mock as a real Pinia setup
// store with module-level refs the tests can mutate.
const watchListedTokens = ref<string[]>([])
const watchListedStocks = ref<string[]>([])
const watchListedPerps = ref<string[]>([])
vi.mock('@/stores/watchlistTableStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useWatchlistStore: defineStore('useWatchlistStore', () => ({
      watchListedTokens,
      watchListedStocks,
      watchListedPerps,
    })),
  }
})

import HomeHero from '@/modules/home/sections/HomeHero.vue'

const mountHero = () => mount(HomeHero, { global: { plugins: [i18n] } })

describe('HomeHero (MEW-2094)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchTrending.mockClear()
    refreshWatchlist.mockClear()
    watchListedTokens.value = []
    watchListedStocks.value = []
    watchListedPerps.value = []
    watchlistRows.value = []
    isLoadingWatchlist.value = false
  })

  it('renders the portfolio card and two trending cards', () => {
    const w = mountHero()
    expect(w.find('[data-test="portfolio-card"]').exists()).toBe(true)
    expect(w.findAll('[data-test="trending"]').length).toBe(2)
  })

  it('hides the promo banner while the flag is off', () => {
    expect(mountHero().find('[data-test="hero-banner"]').exists()).toBe(false)
  })

  it('caps the stocks card at the top 5 trending items', () => {
    const stocksCard = mountHero().findAll('[data-test="trending"]')[0]
    expect(stocksCard.attributes('data-count')).toBe('5')
  })

  it('feeds the crypto card from useCryptoTrending', () => {
    const cryptoCard = mountHero().findAll('[data-test="trending"]')[1]
    expect(cryptoCard.attributes('data-count')).toBe('2')
  })

  it('fetches crypto trending on mount', () => {
    mountHero()
    expect(fetchTrending).toHaveBeenCalledTimes(1)
  })

  it('hides the whole watchlist section while the flag is off', () => {
    // Even with items in the store, nothing watchlist-related renders.
    watchListedStocks.value = ['AAPL']
    watchlistRows.value = [{ key: 'stock-AAPL' }]
    const w = mountHero()
    expect(w.find('[data-test="hero-watchlist-banner"]').exists()).toBe(false)
    expect(w.find('[data-test="home-watchlist-table"]').exists()).toBe(false)
    expect(w.find('[data-test="onboarding-dialog"]').exists()).toBe(false)
  })
})
