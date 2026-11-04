import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick, ref } from 'vue'
import { flushPromises } from '@vue/test-utils'

// Records every URL and answers by endpoint, so a test can assert both the
// query the picker builds and the list it returns.
const calls: string[] = []
const STOCKS = [
  {
    iconPngUrl: 'aapl.png',
    primaryMarket: {
      symbol: 'AAPL',
      price: '190.5',
      priceChangePercentage24h: '-1.25',
    },
    stockAlias: 'Apple',
  },
]
const TOKENS = [
  {
    coinId: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    logoUrl: 'eth.png',
    price: 2500,
    priceChangePercentage24h: 3.5,
    ondo: null,
  },
  // Same asset as the AAPL stock row: must be dropped when both lists merge.
  {
    coinId: 'apple-ondo',
    name: 'Apple xStock',
    symbol: 'AAPLon',
    logoUrl: 'aapl.png',
    price: 190.5,
    priceChangePercentage24h: -1.25,
    ondo: { stockAlias: 'Apple', primaryMarket: { symbol: 'AAPL' } },
  },
]
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: string) => {
      calls.push(url)
      const items = url.includes('/stocks/') ? STOCKS : TOKENS
      return {
        get: () => ({ json: async () => ({ data: ref({ items }) }) }),
      }
    },
  }),
}))

const { mapCryptoItem, mapStockItem, dedupeItems, useAssetPicker } =
  await import('@/modules/home/composables/useAssetPicker')

const params = (url: string) => new URL(url, 'https://x').searchParams

describe('useAssetPicker mappers', () => {
  it('maps a plain crypto token with its price and 24h change', () => {
    expect(mapCryptoItem(TOKENS[0] as never)).toEqual({
      key: 'crypto-ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      logoUrl: 'eth.png',
      type: 'crypto',
      watchlistId: 'ethereum',
      price: 2500,
      change: 3.5,
    })
  })

  it('maps an Ondo tokenized stock in the crypto table to the stock bucket', () => {
    expect(mapCryptoItem(TOKENS[1] as never)).toMatchObject({
      key: 'stock-AAPL',
      symbol: 'AAPLon',
      name: 'Apple',
      type: 'stock',
      watchlistId: 'AAPL',
    })
  })

  it('maps a stock, parsing the string price and change', () => {
    expect(mapStockItem(STOCKS[0] as never)).toEqual({
      key: 'stock-AAPL',
      symbol: 'AAPL',
      name: 'Apple',
      logoUrl: 'aapl.png',
      type: 'stock',
      watchlistId: 'AAPL',
      price: 190.5,
      change: -1.25,
    })
  })

  it('leaves price and change undefined when the API has none', () => {
    const item = mapCryptoItem({
      ...TOKENS[0],
      price: null,
      priceChangePercentage24h: null,
    } as never)
    expect(item.price).toBeUndefined()
    expect(item.change).toBeUndefined()
  })

  it('dedupeItems keeps the first occurrence per key', () => {
    const a = { key: 'stock-AAPL', symbol: 'AAPL' } as never
    const b = { key: 'stock-AAPL', symbol: 'AAPLon' } as never
    const c = { key: 'crypto-eth', symbol: 'ETH' } as never
    expect(dedupeItems([a, b, c])).toEqual([a, c])
  })
})

describe('useAssetPicker', () => {
  beforeEach(() => {
    calls.length = 0
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  const setup = (tab: 'stocks' | 'crypto', category = 'all') => {
    const t = ref(tab)
    const c = ref(category)
    const q = ref('')
    return { t, c, q, ...useAssetPicker(t, c, q) }
  }

  it('loads the stocks table with no category for "all"', async () => {
    const { items } = setup('stocks')
    await flushPromises()
    expect(calls).toHaveLength(1)
    expect(calls[0]).toContain('/v1/web/pages/stocks/table')
    expect(params(calls[0]).has('category')).toBe(false)
    expect(items.value.map(i => i.key)).toEqual(['stock-AAPL'])
  })

  it('sends the picked stock category', async () => {
    const { c } = setup('stocks')
    await flushPromises()
    c.value = 'TECHNOLOGY'
    await flushPromises()
    expect(params(calls[1]).get('category')).toBe('TECHNOLOGY')
  })

  it('sends crypto categories to the tokens table', async () => {
    setup('crypto', 'meme-token')
    await flushPromises()
    expect(calls[0]).toContain('/v1/web/tokens-table')
    expect(params(calls[0]).get('category')).toBe('meme-token')
  })

  it('maps top gainers / losers to a 24h-change sort, not a category', async () => {
    const { c } = setup('crypto', 'topGainers')
    await flushPromises()
    expect(params(calls[0]).get('sort')).toBe(
      'PRICE_CHANGE_PERCENTAGE_24H_DESC',
    )
    expect(params(calls[0]).has('category')).toBe(false)
    c.value = 'topLosers'
    await flushPromises()
    expect(params(calls[1]).get('sort')).toBe('PRICE_CHANGE_PERCENTAGE_24H_ASC')
  })

  it('searches both markets regardless of tab and category, stocks first, deduped', async () => {
    const { q, items } = setup('crypto', 'meme-token')
    await flushPromises()
    calls.length = 0
    q.value = 'a'
    await nextTick()
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(calls).toHaveLength(2)
    for (const url of calls) {
      expect(params(url).get('search')).toBe('a')
      expect(params(url).has('category')).toBe(false)
    }
    expect(items.value.map(i => i.key)).toEqual([
      'stock-AAPL',
      'crypto-ethereum',
    ])
  })

  it('reloads the tab right away when the search is cleared', async () => {
    const { q } = setup('stocks')
    q.value = 'a'
    await nextTick()
    vi.advanceTimersByTime(300)
    await flushPromises()
    calls.length = 0
    q.value = ''
    await nextTick()
    await flushPromises()
    expect(calls).toHaveLength(1)
    expect(calls[0]).toContain('/v1/web/pages/stocks/table')
  })
})
