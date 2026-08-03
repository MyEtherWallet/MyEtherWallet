import { describe, it, expect, vi } from 'vitest'
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
  }),
}))

const openPanel = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
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

// The real AppTabs binds `v-model:activeTabIndex` via `defineModel` — i.e.
// prop `activeTabIndex` + `update:activeTabIndex` emit — and exposes a single
// `tab-panel` slot that HomeNewListings.vue's listing content lives in. This
// stub mirrors both: a button driving the same tab state HomeNewListings
// itself reacts to (stocks index 0 / crypto index 1), plus passthrough of the
// `tab-panel` slot so the cards it contains still render.
const AppTabsStub = {
  props: ['activeTabIndex'],
  emits: ['update:activeTabIndex'],
  template:
    '<div><button data-test="tab-switch" @click="$emit(\'update:activeTabIndex\', activeTabIndex === 0 ? 1 : 0)" /><slot name="tab-panel" /></div>',
}

describe('HomeNewListings', () => {
  const mountIt = () =>
    mount(HomeNewListings, {
      global: {
        plugins: [i18n],
        stubs: {
          AppTabs: AppTabsStub,
          AppSlideGroup: AppSlideGroupStub,
          // AppTokenLogo pulls in stocksStore (Pinia) internally — irrelevant
          // to this section's mapping logic, so it's stubbed rather than
          // wiring a store.
          AppTokenLogo: true,
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

  it('opens the trade panel when a card trade button is clicked', async () => {
    const w = mountIt()
    await w
      .findAll('[data-test="listing-card"]')[0]
      .find('[data-test="listing-trade"]')
      .trigger('click')
    expect(openPanel).toHaveBeenCalledWith('trade')
  })

  it('switches from stocks (2 cards) to crypto (0 cards, empty placeholder) on tab change', async () => {
    const w = mountIt()
    expect(w.findAll('[data-test="listing-card"]').length).toBe(2)

    await w.get('[data-test="tab-switch"]').trigger('click')

    expect(w.findAll('[data-test="listing-card"]').length).toBe(0)
  })
})
