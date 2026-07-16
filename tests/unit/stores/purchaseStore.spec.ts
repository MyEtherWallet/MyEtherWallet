import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePurchaseStore, QUOTE_TTL_MS } from '@/stores/purchaseStore'
import type { FetchSellQuoteParams, SellQuote } from '@/types/buyToken'

vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await vi.importActual<typeof import('pinia')>('pinia')
  const { ref } = await vi.importActual<typeof import('vue')>('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      chains: ref([]),
      selectedChain: ref(null),
    })),
  }
})

vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await vi.importActual<typeof import('pinia')>('pinia')
  const { ref } = await vi.importActual<typeof import('vue')>('vue')
  return {
    useWalletStore: defineStore('wallet', () => ({
      isWalletConnected: ref(false),
    })),
  }
})

const BASE_TIME = 1_700_000_000_000

const sellParams: FetchSellQuoteParams = {
  address: '0x0000000000000000000000000000000000000000',
  fiatCurrency: 'USD',
  amount: '1',
  cryptoCurrency: 'ETH',
  chain: 'ETH',
}

const makeQuote = (fiatAmount: string): SellQuote =>
  ({
    provider: 'MOONPAY',
    crypto_amount: '1',
    crypto_currency: 'ETH',
    crypto_price: '3000',
    fiat_amount: fiatAmount,
    fiat_currency: 'USD',
    fiat_fees: '5',
    chain: 'ETH',
    payment_methods: [],
    url: 'https://example.com/checkout',
  }) as SellQuote

const jsonResponse = (
  body: unknown,
  init?: { status?: number; headers?: Record<string, string> },
) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: init?.headers,
  })

describe('purchaseStore quote fetching', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.setSystemTime(BASE_TIME)
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('sets the expiration timestamp when a sell quote arrives', async () => {
    vi.useFakeTimers({ now: BASE_TIME })
    fetchMock.mockResolvedValueOnce(jsonResponse([makeQuote('100')]))
    const store = usePurchaseStore()

    await store.fetchSellQuote(sellParams)

    expect(store.sellQuote?.fiat_amount).toBe('100')
    expect(store.sellQuoteExpiresAt).toBe(BASE_TIME + QUOTE_TTL_MS)
  })

  it('ignores an out-of-order response so a stale quote cannot overwrite a newer one', async () => {
    let resolveFirst!: (value: Response) => void
    let resolveSecond!: (value: Response) => void
    fetchMock
      .mockImplementationOnce(
        () => new Promise<Response>(r => (resolveFirst = r)),
      )
      .mockImplementationOnce(
        () => new Promise<Response>(r => (resolveSecond = r)),
      )
    const store = usePurchaseStore()

    const first = store.fetchSellQuote(sellParams)
    const second = store.fetchSellQuote({ ...sellParams, amount: '2' })

    resolveSecond(jsonResponse([makeQuote('200')]))
    await second
    expect(store.sellQuote?.fiat_amount).toBe('200')

    resolveFirst(jsonResponse([makeQuote('100')]))
    await first
    expect(store.sellQuote?.fiat_amount).toBe('200')
    expect(store.isFetchingSellQuote).toBe(false)
  })

  it('ignores an in-flight response after the quote is cleared', async () => {
    let resolve!: (value: Response) => void
    fetchMock.mockImplementationOnce(
      () => new Promise<Response>(r => (resolve = r)),
    )
    const store = usePurchaseStore()

    const pending = store.fetchSellQuote(sellParams)
    store.clearSellQuote()

    resolve(jsonResponse([makeQuote('100')]))
    await pending

    expect(store.sellQuote).toBe(null)
    expect(store.sellQuoteExpiresAt).toBe(null)
    expect(store.isFetchingSellQuote).toBe(false)
  })

  it('applies the Retry-After cooldown on 429 and keeps the current quote on a silent refresh', async () => {
    vi.useFakeTimers({ now: BASE_TIME })
    fetchMock.mockResolvedValueOnce(jsonResponse([makeQuote('100')]))
    const store = usePurchaseStore()
    await store.fetchSellQuote(sellParams)

    fetchMock.mockResolvedValueOnce(
      jsonResponse(
        { error: 'rate limited' },
        { status: 429, headers: { 'Retry-After': '10' } },
      ),
    )
    await store.fetchSellQuote(sellParams, { silent: true })

    expect(store.rateLimitedUntil).toBe(BASE_TIME + 10_000)
    expect(store.sellQuote?.fiat_amount).toBe('100')
    expect(store.sellQuoteError).toBe('')
  })

  it('keeps the current quote and surfaces the error when a silent refresh fails', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([makeQuote('100')]))
    const store = usePurchaseStore()
    await store.fetchSellQuote(sellParams)

    fetchMock.mockRejectedValueOnce(new TypeError('network down'))
    await store.fetchSellQuote(sellParams, { silent: true })

    expect(store.sellQuote?.fiat_amount).toBe('100')
    expect(store.sellQuoteError).toBe('Failed to fetch quote')
    expect(store.isFetchingSellQuote).toBe(false)
  })

  it('surfaces an error message when the initial (non-silent) request is rate limited', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: 'rate limited' }, { status: 429 }),
    )
    const store = usePurchaseStore()
    await store.fetchSellQuote(sellParams)

    expect(store.sellQuote).toBe(null)
    expect(store.sellQuoteError).toContain('Too many requests')
    expect(store.rateLimitedUntil).not.toBe(null)
  })

  it('does not set an expiration when the response has no quotes', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))
    const store = usePurchaseStore()
    await store.fetchSellQuote(sellParams)

    expect(store.sellQuote).toBe(null)
    expect(store.sellQuoteExpiresAt).toBe(null)

    fetchMock.mockResolvedValueOnce(jsonResponse([]))
    await store.fetchBuyQuotes({ ...sellParams, iso: 'US' })

    expect(store.buyQuotes).toEqual([])
    expect(store.buyQuotesExpiresAt).toBe(null)
  })

  it('clears the cooldown once a quote request succeeds', async () => {
    vi.useFakeTimers({ now: BASE_TIME })
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: 'rate limited' }, { status: 429 }),
    )
    const store = usePurchaseStore()
    await store.fetchSellQuote(sellParams)
    expect(store.rateLimitedUntil).not.toBe(null)

    fetchMock.mockResolvedValueOnce(jsonResponse([makeQuote('100')]))
    await store.fetchSellQuote(sellParams, { silent: true })
    expect(store.rateLimitedUntil).toBe(null)
  })

  it('ignores an out-of-order buy quotes response', async () => {
    let resolveFirst!: (value: Response) => void
    let resolveSecond!: (value: Response) => void
    fetchMock
      .mockImplementationOnce(
        () => new Promise<Response>(r => (resolveFirst = r)),
      )
      .mockImplementationOnce(
        () => new Promise<Response>(r => (resolveSecond = r)),
      )
    const store = usePurchaseStore()

    const first = store.fetchBuyQuotes({ ...sellParams, iso: 'US' })
    const second = store.fetchBuyQuotes({ ...sellParams, amount: '2', iso: 'US' })

    resolveSecond(jsonResponse([makeQuote('200')]))
    await second
    resolveFirst(jsonResponse([makeQuote('100')]))
    await first

    expect(store.buyQuotes[0]?.fiat_amount).toBe('200')
    expect(store.isFetchingQuotes).toBe(false)
  })
})
