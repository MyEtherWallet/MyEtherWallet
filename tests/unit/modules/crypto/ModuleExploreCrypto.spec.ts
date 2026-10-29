import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { ref, type Ref } from 'vue'
import { createI18n } from 'vue-i18n'

vi.mock('vue-router', async () => ({
  RouterLink: (await import('@vue/test-utils')).RouterLinkStub,
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

// jsdom has no layout: the table wrapper sizes itself from this width.
const cardWidth = ref(1300)
vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementSize: () => ({ width: cardWidth, height: ref(0) }),
}))

const trackSort = vi.fn()
const trackClickToken = vi.fn()
vi.mock('@/analytics', async () => ({
  ...(await vi.importActual('@/analytics/events')),
  analytics: new Proxy(
    {},
    {
      get: (_, key) =>
        key === 'trackCryptoMarketClickSortEvent'
          ? trackSort
          : key === 'trackCryptoMarketClickTokenEvent'
            ? trackClickToken
            : () => {},
    },
  ),
}))

// Each useMEWFetch call (gainers, then table) records its URL ref; execute()
// answers with ITEMS through the registered onFetchResponse callback.
const ITEMS = [
  {
    coinId: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    logoUrl: null,
    price: 3000,
    marketCap: 1e11,
    totalVolume: 1e9,
    priceChangePercentage24h: null,
    sparklineIn7d: [1, 2, 3, 4, 5, 6, 7],
    chains: [],
    nativeChains: [],
    ondo: null,
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
    tokensWatchlistData: ref(null),
    stocksWatchlistData: ref(null),
    fetchAllWatchlist: vi.fn(),
    onTokensWatchlistResponse: vi.fn(),
    onStocksWatchlistResponse: vi.fn(),
  }),
}))
// The real wallet / chains / purchase / input stores pull the Ledger stack.
vi.mock('@/stores/walletStore', () => ({ MAIN_TOKEN_CONTRACT: '0xeeee' }))
vi.mock('@/stores/purchaseStore', () => ({
  usePurchaseStore: () => ({ isBuyableOnCompatibleChain: () => false }),
}))
vi.mock('@/stores/inputStore', () => ({
  useInputStore: () => ({ storeSwapValues: vi.fn() }),
}))
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      isLoaded: ref(false),
      selectedChain: ref(null),
      currentChainhasSwapSupport: ref(false),
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

import ModuleExploreCrypto from '@/modules/crypto/ModuleExploreCrypto.vue'
import AppTableRow from '@/components/table/AppTableRow.vue'
import { CryptoMarketEvent, CryptoMarketLocation } from '@/analytics/events'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: { crypto: { price: 'Price' } } },
})

const mountModule = async () => {
  const wrapper = mount(ModuleExploreCrypto, {
    global: {
      plugins: [i18n],
      directives: { ripple: {} },
      // AppSelect resolves the global router-link.
      stubs: { RouterLink: RouterLinkStub },
    },
  })
  await flushPromises()
  return wrapper
}
const tableUrl = () => new URL(fetches[1].url.value)
const header = (w: Awaited<ReturnType<typeof mountModule>>, label: string) =>
  w.findAll('[role="columnheader"] button').find(b => b.text() === label)!

describe('ModuleExploreCrypto table (MEW-2469)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetches.length = 0
    trackSort.mockClear()
    trackClickToken.mockClear()
    cardWidth.value = 1300
    respond = true
  })

  it('titles the page with an h1', async () => {
    const w = await mountModule()
    expect(w.get('h1').text()).toBe('crypto.explore_tokens')
  })

  it('links the row to the token page and tracks the click', async () => {
    const w = await mountModule()
    const link = w.getComponent(RouterLinkStub)
    expect(link.props('to')).toEqual({
      name: TOKEN_INFO_ROUTE_NAMES.crypto,
      params: { tokenId: 'ethereum' },
    })
    await link.trigger('click')
    expect(trackClickToken).toHaveBeenCalledWith(
      CryptoMarketEvent.CLICK_TOKEN,
      {
        location: CryptoMarketLocation.TOKEN_ROW,
        tokenName: 'Ethereum',
        tokenSymbol: 'eth',
      },
    )
  })

  it('shows "-" next to the sparkline when the 24h change is unknown', async () => {
    const w = await mountModule()
    const cell = w
      .findAll('[role="rowgroup"] [role="cell"]')
      .find(c => c.find('[data-test="table-cell-sparkline"]').exists())!
    expect(cell.text()).toBe('-')
  })

  it('shows a page of skeleton rows while loading', async () => {
    respond = false
    const w = await mountModule()
    expect(w.get('[role="table"]').attributes('aria-busy')).toBe('true')
    expect(w.findAllComponents(AppTableRow)).toHaveLength(10)

    respond = true
    fetches[1].execute()
    await flushPromises()
    expect(w.findAllComponents(AppTableRow)).toHaveLength(1)
  })

  it('drives the API sort from the header and returns to market cap', async () => {
    const w = await mountModule()
    expect(tableUrl().searchParams.get('sort')).toBe('MARKET_CAP_DESC')

    await header(w, 'Price').trigger('click')
    expect(tableUrl().searchParams.get('sort')).toBe('PRICE_DESC')
    await header(w, 'Price').trigger('click')
    expect(tableUrl().searchParams.get('sort')).toBe('PRICE_ASC')

    // Third click returns to the default sort, still reported as Price.
    await header(w, 'Price').trigger('click')
    expect(tableUrl().searchParams.get('sort')).toBe('MARKET_CAP_DESC')
    expect(trackSort).toHaveBeenCalledTimes(3)
    expect(trackSort).toHaveBeenLastCalledWith(CryptoMarketEvent.CLICK_SORT, {
      sortOption: 'price',
    })
  })

  it('puts the S menu actions in buttons so the keyboard reaches them', async () => {
    cardWidth.value = 400
    // An Ondo token gets the Trade item.
    const item = ITEMS[0] as { ondo: unknown }
    item.ondo = { primaryMarket: { symbol: 'ETHon' }, underlyingMarket: null }
    try {
      const w = await mountModule()
      const items = w.findAll('[role="cell"] li')
      expect(items.length).toBeGreaterThan(0)
      for (const li of items)
        expect(li.find('button[type="button"]').exists()).toBe(true)
    } finally {
      item.ondo = null
    }
  })
})
