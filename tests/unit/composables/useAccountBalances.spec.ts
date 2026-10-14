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
  BALANCE_BATCH_WINDOW_MS,
  type BalanceEntry,
} from '@/composables/useAccountBalances'

const ONE_ETH = '0x0de0b6b3a7640000'
const entry = (
  address: string,
  extra: Partial<BalanceEntry> = {},
): BalanceEntry => ({
  chainName: 'ETHEREUM',
  chainId: '1',
  chainType: 'EVM',
  nativePrice: 3,
  address,
  ...extra,
})

/** Let the batch window elapse (fake timers) and the queued fetch settle. */
const flush = async <T>(p: Promise<T>): Promise<T> => {
  await vi.advanceTimersByTimeAsync(BALANCE_BATCH_WINDOW_MS)
  return p
}

beforeEach(() => {
  fetchMock.mockReset()
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(0)
})
afterEach(() => vi.useRealTimers())

describe('useAccountBalances', () => {
  it('fetchIfStale fetches an uncached address through the batch endpoint, values the native balance, and caches', async () => {
    fetchMock.mockResolvedValue([{ address: '0x1', value: ONE_ETH }])
    const { cached, fetchIfStale } = useAccountBalances()
    await flush(fetchIfStale(entry('0x1')))
    expect(fetchMock).toHaveBeenCalledWith(
      '/v1/evm/chains/1/balances?addresses=0x1',
    )
    expect(cached('ETHEREUM', '0x1')).toEqual({ usdValue: 3, tokenCount: 1 })
  })

  it('folds every request for the same chain inside the batch window into ONE call', async () => {
    fetchMock.mockResolvedValue([
      { address: '0x1', value: ONE_ETH },
      { address: '0x2', value: '0x0' },
    ])
    const { cached, fetchIfStale, loadingFor } = useAccountBalances()
    const p1 = fetchIfStale(entry('0x1'))
    const p2 = fetchIfStale(entry('0x2'))
    const p3 = fetchIfStale(entry('0x3'))
    expect(loadingFor('ETHEREUM', '0x2')).toBe(true)
    await flush(Promise.all([p1, p2, p3]))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/v1/evm/chains/1/balances?addresses=0x1,0x2,0x3',
    )
    expect(cached('ETHEREUM', '0x1')).toEqual({ usdValue: 3, tokenCount: 1 })
    // Zero and not-returned addresses both cache as empty so the row stops spinning.
    expect(cached('ETHEREUM', '0x2')).toEqual({ usdValue: 0, tokenCount: 0 })
    expect(cached('ETHEREUM', '0x3')).toEqual({ usdValue: 0, tokenCount: 0 })
    expect(loadingFor('ETHEREUM', '0x2')).toBe(false)
  })

  it('splits a chain batch above 10 addresses into 10-address requests', async () => {
    fetchMock.mockResolvedValue([])
    const { fetchIfStale } = useAccountBalances()
    const all = Array.from({ length: 12 }, (_, i) =>
      fetchIfStale(entry(`0x${i}`)),
    )
    await flush(Promise.all(all))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('keeps different chains in separate batches and routes Bitcoin to the BTC endpoint', async () => {
    fetchMock.mockResolvedValue([])
    const { fetchIfStale } = useAccountBalances()
    await flush(
      Promise.all([
        fetchIfStale(entry('0x1')),
        fetchIfStale(
          entry('bc1q', {
            chainName: 'BITCOIN',
            chainType: 'BITCOIN',
            chainId: undefined,
          }),
        ),
      ]),
    )
    const urls = fetchMock.mock.calls.map(c => c[0])
    expect(urls).toEqual([
      '/v1/evm/chains/1/balances?addresses=0x1',
      '/v1/btc/BITCOIN/balances?addresses=bc1q',
    ])
  })

  it('fetchIfStale serves from cache within the TTL and re-fetches after it', async () => {
    fetchMock.mockResolvedValue([{ address: '0x1', value: ONE_ETH }])
    const { fetchIfStale } = useAccountBalances()
    await flush(fetchIfStale(entry('0x1')))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const fetchedAt = Date.now()

    vi.setSystemTime(fetchedAt + BALANCE_TTL_MS - 1) // still fresh → no fetch
    await flush(fetchIfStale(entry('0x1')))
    expect(fetchMock).toHaveBeenCalledTimes(1)

    vi.setSystemTime(fetchedAt + BALANCE_TTL_MS + 1) // past TTL → re-fetch
    await flush(fetchIfStale(entry('0x1')))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('isStale is true when absent, false when fresh, true past the TTL', async () => {
    const { isStale, refreshOne } = useAccountBalances()
    expect(isStale('ETHEREUM', '0xZ')).toBe(true) // never fetched
    fetchMock.mockResolvedValue([])
    await flush(refreshOne(entry('0xZ')))
    expect(isStale('ETHEREUM', '0xZ')).toBe(false)
    vi.setSystemTime(Date.now() + BALANCE_TTL_MS + 1)
    expect(isStale('ETHEREUM', '0xZ')).toBe(true)
  })

  it('dedupes concurrent fetches for the same address (one request, one entry)', async () => {
    fetchMock.mockResolvedValue([{ address: '0x1', value: ONE_ETH }])
    const { fetchIfStale } = useAccountBalances()
    await flush(
      Promise.all([fetchIfStale(entry('0x1')), fetchIfStale(entry('0x1'))]),
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/v1/evm/chains/1/balances?addresses=0x1',
    )
  })

  it('loadingFor is true while queued / in flight and false once resolved', async () => {
    let resolveFetch: (v: unknown) => void = () => {}
    fetchMock.mockReturnValue(new Promise(r => (resolveFetch = r)))
    const { fetchIfStale, loadingFor } = useAccountBalances()
    const p = fetchIfStale(entry('0x1'))
    expect(loadingFor('ETHEREUM', '0x1')).toBe(true)
    await vi.advanceTimersByTimeAsync(BALANCE_BATCH_WINDOW_MS)
    expect(loadingFor('ETHEREUM', '0x1')).toBe(true)
    resolveFetch([])
    await p
    expect(loadingFor('ETHEREUM', '0x1')).toBe(false)
  })

  it('refreshOne force-fetches even when the cache is still fresh', async () => {
    fetchMock.mockResolvedValue([{ address: '0x1', value: ONE_ETH }])
    const { cached, fetchIfStale, refreshOne } = useAccountBalances()
    await flush(fetchIfStale(entry('0x1')))
    fetchMock.mockResolvedValue([{ address: '0x1', value: ONE_ETH }])
    await flush(refreshOne(entry('0x1', { nativePrice: 9 }))) // still fresh, but forced
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(cached('ETHEREUM', '0x1')?.usdValue).toBe(9)
  })

  it('records a zero balance for every entry of a failed batch without throwing', async () => {
    fetchMock.mockRejectedValueOnce(new Error('429 rate limited'))
    const { cached, fetchIfStale, loadingFor } = useAccountBalances()
    await flush(
      Promise.all([fetchIfStale(entry('0x9')), fetchIfStale(entry('0x8'))]),
    )
    expect(cached('ETHEREUM', '0x9')).toEqual({ usdValue: 0, tokenCount: 0 })
    expect(cached('ETHEREUM', '0x8')).toEqual({ usdValue: 0, tokenCount: 0 })
    expect(loadingFor('ETHEREUM', '0x9')).toBe(false)
  })

  it('values Bitcoin balances with 8 decimals', async () => {
    fetchMock.mockResolvedValue([
      {
        address: 'bc1q',
        balance: { nativeValue: '50000000', nativeSymbol: 'BTC' },
      },
    ])
    const { cached, fetchIfStale } = useAccountBalances()
    await flush(
      fetchIfStale(
        entry('bc1q', {
          chainName: 'BITCOIN',
          chainType: 'BITCOIN',
          chainId: undefined,
          nativePrice: 100,
        }),
      ),
    )
    expect(cached('BITCOIN', 'bc1q')).toEqual({ usdValue: 50, tokenCount: 1 })
  })

  it('set seeds a known balance (fresh) without fetching', () => {
    const { cached, isStale, set } = useAccountBalances()
    set('ETH', '0x5', { usdValue: 42, tokenCount: 3 })
    expect(cached('ETH', '0x5')).toEqual({ usdValue: 42, tokenCount: 3 })
    expect(isStale('ETH', '0x5')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('persists the cache to localStorage (keyed by chain + address, lower-cased)', async () => {
    fetchMock.mockResolvedValue([{ address: '0xAbC', value: ONE_ETH }])
    const { fetchIfStale } = useAccountBalances()
    await flush(fetchIfStale(entry('0xAbC')))
    await nextTick()
    const stored = JSON.parse(
      localStorage.getItem('multiAddressBalances') || '{}',
    )
    expect(stored['ethereum:0xabc']).toMatchObject({
      usdValue: 3,
      tokenCount: 1,
    })
  })

  it('caches per (chain, address): the same address on a different chain is a separate entry', async () => {
    // Each chain keeps its own snapshot, so switching networks fetches that chain's
    // balance and never returns another chain's value (MEW-2179).
    fetchMock.mockResolvedValueOnce([{ address: '0x1', value: ONE_ETH }]) // ETHEREUM → 3
    fetchMock.mockResolvedValueOnce([
      { address: '0x1', value: '0x1bc16d674ec80000' },
    ]) // BSC → 2 × 3
    const { fetchIfStale, cached } = useAccountBalances()
    await flush(fetchIfStale(entry('0x1')))
    // Same address, different chain, within the TTL → still fetches (separate key).
    await flush(fetchIfStale(entry('0x1', { chainName: 'BSC', chainId: '56' })))
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][0]).toBe(
      '/v1/evm/chains/56/balances?addresses=0x1',
    )
    // Each chain shows its own value; no cross-chain bleed.
    expect(cached('ETHEREUM', '0x1')).toEqual({ usdValue: 3, tokenCount: 1 })
    expect(cached('BSC', '0x1')).toEqual({ usdValue: 6, tokenCount: 1 })
    // Re-querying the same (chain, address) within the TTL is served from cache.
    await flush(fetchIfStale(entry('0x1')))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('uses a 75s TTL (MEW-2179)', () => {
    expect(BALANCE_TTL_MS).toBe(75_000)
  })
})
