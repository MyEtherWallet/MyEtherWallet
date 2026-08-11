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

import HomeHero from '@/modules/home/sections/HomeHero.vue'

const mountHero = () => mount(HomeHero, { global: { plugins: [i18n] } })

describe('HomeHero (MEW-2094)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchTrending.mockClear()
  })

  it('renders the portfolio card and two trending cards', () => {
    const w = mountHero()
    expect(w.find('[data-test="portfolio-card"]').exists()).toBe(true)
    expect(w.findAll('[data-test="trending"]').length).toBe(2)
  })

  it('shows the promo banner above the cards', () => {
    expect(mountHero().find('[data-test="hero-banner"]').exists()).toBe(true)
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
})
