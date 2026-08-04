import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// HomeNewListings uses useI18n() (Composition API), which needs the i18n
// plugin installed on the app instance. Mirrors the pattern used in
// tests/unit/modules/home/ModuleHome.spec.ts.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

// Real StockOverviewItem shape (src/mew_api/schema.ts →
// GetWebStocksOverviewResponse['newlyAdded'][number]): fields are nested
// under primaryMarket/underlyingMarket, not flat name/symbol/changePercent.
// `price` is a raw numeric string per the API schema (e.g. "172.34"), with no
// currency symbol — formatting is HomeNewListings' job, via useCurrency below.
vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () => ({
    newlyAdded: [
      {
        stockAlias: 'AAPL',
        iconPngUrl: undefined,
        primaryMarket: {
          symbol: 'AAPL',
          price: '172.34',
          priceChangePercentage24h: '1.5',
          sparkline24h: [],
        },
        underlyingMarket: { name: 'Apple', volume24h: '0', marketCap: '0' },
      },
      {
        stockAlias: 'TSLA',
        iconPngUrl: undefined,
        primaryMarket: {
          symbol: 'TSLA',
          price: '248.5',
          priceChangePercentage24h: '-1.5',
          sparkline24h: [],
        },
        underlyingMarket: { name: 'Tesla', volume24h: '0', marketCap: '0' },
      },
    ],
  }),
}))

// Mirrors TokenRow.vue's use of useCurrency().formatFiat(price).display —
// mocked directly (rather than through the real currencyStore/purchaseStore
// chain) since only the formatting call-site in HomeNewListings is under
// test here.
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    formatFiat: (value: string | number) => ({ display: `$${value}` }),
    formatFiatCompact: (value: string | number) => ({ display: `$${value}` }),
  }),
}))

const openPanel = vi.fn()
const setSelectedTradeTokenSymbol = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel, setSelectedTradeTokenSymbol }),
}))

const setWatchlistItem = vi.fn()
const isWatchListed = vi.fn(() => false)
vi.mock('@/stores/watchlistTableStore', () => ({
  useWatchlistStore: () => ({ setWatchlistItem, isWatchListed }),
}))

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

// Crypto tab data — the `newCoins` from the crypto overview composable.
const newCoins = ref([
  {
    coinId: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 60000,
    priceChangePercentage24h: 2.1,
    logoUrl: null,
    ondo: null,
  },
])
const fetchNewCoins = vi.fn()
vi.mock('@/modules/home/composables/useCryptoNewCoins', () => ({
  useCryptoNewCoins: () => ({ newCoins, fetchNewCoins, isLoading: ref(false) }),
}))

// Crypto swap preselect is exercised in its own spec (useNewListingSwap.spec.ts);
// here we only assert HomeNewListings delegates to it with the coin's
// symbol/name and supportedChains.
const openSwapForToken = vi.fn()
vi.mock('@/modules/home/composables/useNewListingSwap', () => ({
  useNewListingSwap: () => ({ openSwapForToken }),
}))

import HomeNewListings from '@/modules/home/sections/HomeNewListings.vue'

// The real AppSlideGroup renders content through per-index named slots
// (#item-0, #item-1, ...), not a default slot — see
// src/components/app_slide_group/AppSlideGroup.vue and its usage in
// src/modules/stocks/ModuleTopMovers.vue. The stub mirrors that for the two
// mocked items.
const AppSlideGroupStub = {
  template: '<div><slot name="item-0" /><slot name="item-1" /></div>',
}

// The real AppTabBar is an index-based `v-model` (prop `modelValue` +
// `update:modelValue`); the listing content is now a SIBLING of it, not a
// slot. The stub is just a button that toggles the tab index HomeNewListings
// reacts to (stocks index 0 / crypto index 1).
const AppTabBarStub = {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template:
    '<button data-test="tab-switch" @click="$emit(\'update:modelValue\', modelValue === 0 ? 1 : 0)" />',
}

describe('HomeNewListings', () => {
  const mountIt = () =>
    mount(HomeNewListings, {
      global: {
        plugins: [i18n],
        stubs: {
          AppTabBar: AppTabBarStub,
          // Tooltip wraps each card; render its slot inline (skip teleport/hover).
          AppTooltipHint: { template: '<div><slot /></div>' },
          AppSlideGroup: AppSlideGroupStub,
          // AppTokenLogo + AppTokenSymbol pull in stocksStore (Pinia)
          // internally — irrelevant to this section's mapping logic, so
          // they're stubbed. AppTokenSymbol still renders the symbol text.
          AppTokenLogo: true,
          AppTokenSymbol: {
            props: ['symbol'],
            template: '<span>{{ symbol }}</span>',
          },
        },
      },
    })

  it('renders a card per newly-added item on the stocks tab', () => {
    const w = mountIt()
    expect(w.findAll('[data-test="listing-card"]').length).toBe(2)
  })

  it('maps the real StockOverviewItem fields onto the card', () => {
    const w = mountIt()
    const cards = w.findAll('[data-test="listing-card"]')
    expect(cards[0].text()).toContain('AAPL')
    expect(cards[0].text()).toContain('Apple')
    expect(cards[0].find('.text-success').exists()).toBe(true)
    expect(cards[1].text()).toContain('TSLA')
    expect(cards[1].text()).toContain('Tesla')
    expect(cards[1].find('.text-error').exists()).toBe(true)
  })

  it('formats the raw price string via useCurrency before handing it to the card', () => {
    const w = mountIt()
    const cards = w.findAll('[data-test="listing-card"]')
    expect(cards[0].text()).toContain('$172.34')
    expect(cards[1].text()).toContain('$248.5')
  })

  it('routes to the stock detail page when a card is selected', async () => {
    const w = mountIt()
    await w.findAll('[data-test="listing-card"]')[0].trigger('click')
    expect(push).toHaveBeenCalledWith({
      name: expect.anything(),
      params: { symbol: 'AAPL' },
    })
  })

  it('preselects the stock token and opens the trade panel on trade CTA', async () => {
    openPanel.mockClear()
    setSelectedTradeTokenSymbol.mockClear()
    const w = mountIt()
    await w
      .findAll('[data-test="listing-card"]')[0]
      .find('[data-test="listing-trade"]')
      .trigger('click')
    // Trade restores its "to" token from selectedTradeTokenSymbol, so the symbol
    // must be set before the panel opens — otherwise the drawer keeps the old token.
    expect(setSelectedTradeTokenSymbol).toHaveBeenCalledWith('AAPL')
    expect(openPanel).toHaveBeenCalledWith('trade')
  })

  it('switches from stocks (2 cards) to crypto newCoins on tab change', async () => {
    const w = mountIt()
    expect(w.findAll('[data-test="listing-card"]').length).toBe(2)

    await w.get('[data-test="tab-switch"]').trigger('click')

    const cards = w.findAll('[data-test="listing-card"]')
    expect(cards.length).toBe(1)
    expect(cards[0].text()).toContain('BTC')
  })

  it('toggles a crypto coin as a token (isStock=false) on the crypto tab', async () => {
    setWatchlistItem.mockClear()
    const w = mountIt()
    await w.get('[data-test="tab-switch"]').trigger('click') // crypto
    await w
      .findAll('[data-test="listing-card"]')[0]
      .get('[data-test="listing-favorite"]')
      .trigger('click')
    expect(setWatchlistItem).toHaveBeenCalledWith('btc', false)
  })

  it('preselects + opens swap via useNewListingSwap from a crypto card CTA', async () => {
    openSwapForToken.mockClear()
    setSelectedTradeTokenSymbol.mockClear()
    const w = mountIt()
    await w.get('[data-test="tab-switch"]').trigger('click') // crypto
    await w
      .findAll('[data-test="listing-card"]')[0]
      .get('[data-test="listing-trade"]')
      .trigger('click')
    // Swap matches its "to" token by on-chain address, so the symbol/name plus
    // the payload's supportedChains (undefined here) is handed to
    // useNewListingSwap, which resolves the contract + opens Swap.
    expect(openSwapForToken).toHaveBeenCalledWith('BTC', 'Bitcoin', undefined)
    // Crypto uses Swap, never the trade-symbol path.
    expect(setSelectedTradeTokenSymbol).not.toHaveBeenCalled()
  })

  it('forwards supportedChains to useNewListingSwap when the payload carries them', async () => {
    openSwapForToken.mockClear()
    const chains = [{ chainName: 'Ethereum', contract: '0xABC' }]
    const original = newCoins.value
    // BE sends supportedChains on newCoins (same shape as the stocks response).
    newCoins.value = [{ ...original[0], supportedChains: chains } as any]
    const w = mountIt()
    await w.get('[data-test="tab-switch"]').trigger('click') // crypto
    await w
      .findAll('[data-test="listing-card"]')[0]
      .get('[data-test="listing-trade"]')
      .trigger('click')
    expect(openSwapForToken).toHaveBeenCalledWith('BTC', 'Bitcoin', chains)
    newCoins.value = original
  })

  it('toggles the stock in the shared watchlist when the favorite star is clicked', async () => {
    setWatchlistItem.mockClear()
    const w = mountIt()
    await w
      .findAll('[data-test="listing-card"]')[0]
      .get('[data-test="listing-favorite"]')
      .trigger('click')
    expect(setWatchlistItem).toHaveBeenCalledWith('AAPL', true)
  })

  it('shows a favorited (solid/blue) star when the stock is already watchlisted', () => {
    isWatchListed.mockReturnValue(true)
    const favorite = mountIt()
      .findAll('[data-test="listing-card"]')[0]
      .get('[data-test="listing-favorite"]')
    expect(favorite.find('.text-primary').exists()).toBe(true)
    isWatchListed.mockReturnValue(false)
  })
})
