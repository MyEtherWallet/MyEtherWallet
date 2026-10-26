import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { ref, type Ref } from 'vue'
import { createI18n } from 'vue-i18n'

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push, replace: vi.fn() }),
}))

// jsdom has no layout: the table wrapper sizes itself from this width.
const cardWidth = ref(1300)
vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementSize: () => ({ width: cardWidth, height: ref(0) }),
}))

const trackSort = vi.fn()
vi.mock('@/analytics', () => ({
  analytics: new Proxy(
    {},
    {
      get: (_, key) =>
        key === 'trackStockMarketClickSortEvent' ? trackSort : () => {},
    },
  ),
  ClickTokenTradeEvent: {},
  StockMarketEvent: {},
}))

// Each useMEWFetch call (gainers, then table) records its URL ref; execute()
// answers with ITEMS through the registered onFetchResponse callback.
const ITEMS = [
  {
    stockAlias: 'Apple',
    primaryMarket: {
      symbol: 'AAPLon',
      price: '256.72',
      priceChangePercentage24h: '2.87',
      sparkline24h: [1, 2, 3],
    },
    underlyingMarket: { name: 'Apple Inc', marketCap: 1e12, volume24h: 1e9 },
  },
]
const fetches: { url: Ref<string>; execute: ReturnType<typeof vi.fn> }[] = []
// Off: execute() never answers, so the table stays loading.
let respond = true
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: Ref<string>) => {
      const data = ref<unknown>(null)
      let onResponse = () => {}
      const execute = vi.fn(() => {
        if (!respond) return
        data.value = { items: ITEMS, total: 1, pages: 1 }
        onResponse()
      })
      fetches.push({ url, execute })
      const api = {
        data,
        execute,
        onFetchResponse: (cb: () => void) => (onResponse = cb),
      }
      return { get: () => ({ json: () => api }) }
    },
  }),
}))
vi.mock('@/composables/useFetchWatchlist', () => ({
  useFetchWatchlist: () => ({
    stocksWatchlistData: ref(null),
    fetchStocksWatchlist: vi.fn(),
    onStocksWatchlistResponse: vi.fn(),
  }),
}))
// The real chains/currency stores pull walletStore (Ledger) — keep them minimal.
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      isLoaded: ref(false),
      selectedChain: ref(null),
    })),
  }
})
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({ formatFiat: (n: number) => ({ display: `$${n}` }) }),
}))
vi.mock('@/components/AppTokenLogo.vue', () => ({
  default: { template: '<span />' },
}))
vi.mock('@/components/select_chain/SelectChainDialog.vue', () => ({
  default: { template: '<div />' },
}))

import ModuleAllStock from '@/modules/stocks/ModuleAllStock.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: { stocks: { price: 'Price', market_cap: 'Market cap' } },
  },
})

const mountModule = async () => {
  const wrapper = mount(ModuleAllStock, {
    global: {
      plugins: [i18n],
      directives: { ripple: {} },
      stubs: { RouterLink: true },
    },
  })
  await flushPromises()
  return wrapper
}
const tableUrl = () => new URL(fetches[1].url.value)
const header = (w: Awaited<ReturnType<typeof mountModule>>, label: string) =>
  w.findAll('[role="columnheader"] button').find(b => b.text() === label)!

describe('ModuleAllStock table (MEW-2469)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetches.length = 0
    trackSort.mockClear()
    push.mockClear()
    cardWidth.value = 1300
    respond = true
  })

  it('renders the fetched stocks as table rows', async () => {
    const w = await mountModule()
    const rows = w.findAllComponents(AppTableRow)
    expect(rows).toHaveLength(1)
    expect(rows[0].props('description')).toBe('Apple')
    await rows[0].trigger('click')
    expect(push).toHaveBeenCalledWith(
      expect.objectContaining({ params: { symbol: 'AAPLon' } }),
    )
  })

  it('titles a stock with its ticker and a gradient "on"', async () => {
    const w = await mountModule()
    const title = w.get('[role="rowgroup"] [data-testid="cg-title"]')
    expect(title.text()).toBe('AAPLon')
    expect(title.get('span.bg-stock-gradient').text()).toBe('on')
  })

  it('blanks the pagination label while loading', async () => {
    respond = false
    const w = await mountModule()
    expect(w.get('nav p').text()).toBe('')

    respond = true
    fetches[1].execute()
    await flushPromises()
    expect(w.get('nav p').text()).toBe('common.showing_page')
  })

  it('drives the API sort from the header and falls back to market cap', async () => {
    const w = await mountModule()
    expect(tableUrl().searchParams.get('sort')).toBe('MARKET_CAP_DESC')

    await header(w, 'Price').trigger('click')
    expect(tableUrl().searchParams.get('sort')).toBe('PRICE_DESC')
    expect(trackSort).toHaveBeenLastCalledWith(undefined, {
      sortOption: 'price',
    })

    await header(w, 'Price').trigger('click')
    expect(tableUrl().searchParams.get('sort')).toBe('PRICE_ASC')

    // Third click turns the column off → the default sort.
    await header(w, 'Price').trigger('click')
    expect(tableUrl().searchParams.get('sort')).toBe('MARKET_CAP_DESC')
    expect(trackSort).toHaveBeenLastCalledWith(undefined, {
      sortOption: 'price',
    })
  })

  it('keeps only the name and market cap columns at size S', async () => {
    cardWidth.value = 400
    const w = await mountModule()
    const labels = w.findAll('[role="columnheader"]').map(h => h.text())
    expect(labels).toContain('Market cap')
    expect(labels).not.toContain('Price')
  })
})
