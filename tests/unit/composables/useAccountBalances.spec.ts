// tests/unit/composables/useAccountBalances.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'

const fetchMock = vi.fn()
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: (...args: unknown[]) => fetchMock(...args),
}))

import {
  useAccountBalances,
  BALANCE_TTL_MS,
} from '@/composables/useAccountBalances'

beforeEach(() => {
  fetchMock.mockReset()
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(0)
})
afterEach(() => vi.useRealTimers())

describe('useAccountBalances', () => {
  it('fetchIfStale fetches an uncached address, reduces to usdValue + tokenCount, and caches', async () => {
    fetchMock.mockResolvedValue({
      result: [
        { balance: '2', decimals: 0, price: 3 }, // 6 USD
        { balance: '0', decimals: 0, price: 100 }, // zero balance, ignored in count
        { balance: '1', decimals: 0, price: 4 }, // 4 USD
      ],
    })
    const { cached, fetchIfStale } = useAccountBalances()
    await fetchIfStale({ chainName: 'ETHEREUM', address: '0x1' })
    expect(fetchMock).toHaveBeenCalledWith(
      '/balances/ETHEREUM/0x1/?noInjectErrors=false&sparklines=true',
    )
    expect(cached('ETHEREUM', '0x1')).toEqual({ usdValue: 10, tokenCount: 2 })
  })

  it('fetchIfStale serves from cache within the TTL and re-fetches after it', async () => {
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 5 }] })
    const { fetchIfStale } = useAccountBalances()
    await fetchIfStale({ chainName: 'ETH', address: '0x1' })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    vi.setSystemTime(BALANCE_TTL_MS - 1) // still fresh → no fetch
    await fetchIfStale({ chainName: 'ETH', address: '0x1' })
    expect(fetchMock).toHaveBeenCalledTimes(1)

    vi.setSystemTime(BALANCE_TTL_MS + 1) // past TTL → re-fetch
    await fetchIfStale({ chainName: 'ETH', address: '0x1' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('isStale is true when absent, false when fresh, true past the TTL', async () => {
    const { isStale, refreshOne } = useAccountBalances()
    expect(isStale('ETH', '0xZ')).toBe(true) // never fetched
    fetchMock.mockResolvedValue({ result: [] })
    await refreshOne({ chainName: 'ETH', address: '0xZ' })
    expect(isStale('ETH', '0xZ')).toBe(false)
    vi.setSystemTime(BALANCE_TTL_MS + 1)
    expect(isStale('ETH', '0xZ')).toBe(true)
  })

  it('dedupes concurrent fetches for the same address (one request)', async () => {
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 5 }] })
    const { fetchIfStale } = useAccountBalances()
    await Promise.all([
      fetchIfStale({ chainName: 'ETH', address: '0x1' }),
      fetchIfStale({ chainName: 'ETH', address: '0x1' }),
    ])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('loadingFor is true while in flight and false once resolved', async () => {
    let resolveFetch: (v: unknown) => void = () => {}
    fetchMock.mockReturnValue(new Promise(r => (resolveFetch = r)))
    const { fetchIfStale, loadingFor } = useAccountBalances()
    const p = fetchIfStale({ chainName: 'ETH', address: '0x1' })
    expect(loadingFor('ETH', '0x1')).toBe(true)
    resolveFetch({ result: [] })
    await p
    expect(loadingFor('ETH', '0x1')).toBe(false)
  })

  it('refreshOne force-fetches even when the cache is still fresh', async () => {
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 7 }] })
    const { cached, fetchIfStale, refreshOne } = useAccountBalances()
    await fetchIfStale({ chainName: 'ETH', address: '0x1' })
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 9 }] })
    await refreshOne({ chainName: 'ETH', address: '0x1' }) // still fresh, but forced
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(cached('ETH', '0x1')?.usdValue).toBe(9)
  })

  it('records a zero balance on fetch error without throwing', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'))
    const { cached, fetchIfStale } = useAccountBalances()
    await fetchIfStale({ chainName: 'ETHEREUM', address: '0x9' })
    expect(cached('ETHEREUM', '0x9')).toEqual({ usdValue: 0, tokenCount: 0 })
  })

  it('skips malformed balances, parses hex, and values the native token by chain price', async () => {
    fetchMock.mockResolvedValue({
      result: [
        { balance: 'N/A', decimals: 0, price: 5 }, // malformed — skipped
        { balance: '0x0de0b6b3a7640000', decimals: 18, price: null, contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' }, // 1 native → 3 USD via nativePrice
      ],
    })
    const { cached, fetchIfStale } = useAccountBalances()
    await fetchIfStale({ chainName: 'ETH', address: '0xN', nativePrice: 3 })
    expect(cached('ETH', '0xN')).toEqual({ usdValue: 3, tokenCount: 1 })
  })

  it('set seeds a known balance (fresh) without fetching', () => {
    const { cached, isStale, set } = useAccountBalances()
    set('ETH', '0x5', { usdValue: 42, tokenCount: 3 })
    expect(cached('ETH', '0x5')).toEqual({ usdValue: 42, tokenCount: 3 })
    expect(isStale('ETH', '0x5')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('persists the cache to localStorage (keyed by chain + address, lower-cased)', async () => {
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 8 }] })
    const { fetchIfStale } = useAccountBalances()
    await fetchIfStale({ chainName: 'ETH', address: '0xAbC' })
    await nextTick()
    const stored = JSON.parse(localStorage.getItem('multiAddressBalances') || '{}')
    expect(stored['eth:0xabc']).toMatchObject({ usdValue: 8, tokenCount: 1 })
  })
})
