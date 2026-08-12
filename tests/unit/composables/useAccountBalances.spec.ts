// tests/unit/composables/useAccountBalances.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

const fetchMock = vi.fn()
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: (...args: unknown[]) => fetchMock(...args),
}))

import { useAccountBalances } from '@/composables/useAccountBalances'

beforeEach(() => {
  fetchMock.mockReset()
  localStorage.clear()
})

describe('useAccountBalances', () => {
  it('fetchMissing fetches by address, reduces to usdValue + tokenCount, and caches', async () => {
    fetchMock.mockResolvedValue({
      result: [
        { balance: '2', decimals: 0, price: 3 }, // 6 USD
        { balance: '0', decimals: 0, price: 100 }, // zero balance, ignored in count
        { balance: '1', decimals: 0, price: 4 }, // 4 USD
      ],
    })
    const { cached, fetchMissing, isLoading } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETHEREUM', address: '0x1' }])
    expect(fetchMock).toHaveBeenCalledWith(
      '/balances/ETHEREUM/0x1/?noInjectErrors=false&sparklines=true',
    )
    expect(cached('ETHEREUM', '0x1')).toEqual({ usdValue: 10, tokenCount: 2 })
    expect(isLoading.value).toBe(false)
  })

  it('fetchMissing does NOT re-fetch an address already cached for the chain', async () => {
    fetchMock.mockResolvedValue({
      result: [{ balance: '1', decimals: 0, price: 5 }],
    })
    const { fetchMissing } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETHEREUM', address: '0x1' }])
    await fetchMissing([{ chainName: 'ETHEREUM', address: '0x1' }])
    expect(fetchMock).toHaveBeenCalledTimes(1) // second call served from cache
  })

  it('records a zero balance on fetch error without throwing', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'))
    const { cached, fetchMissing } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETHEREUM', address: '0x9' }])
    expect(cached('ETHEREUM', '0x9')).toEqual({ usdValue: 0, tokenCount: 0 })
  })

  it('skips malformed token balances and still counts valid tokens', async () => {
    fetchMock.mockResolvedValue({
      result: [
        { balance: 'N/A', decimals: 0, price: 5 }, // malformed — skipped
        { balance: '', decimals: 0, price: 5 }, // empty — skipped
        { balance: '3', decimals: 0, price: 2 }, // valid: 6 USD
      ],
    })
    const { cached, fetchMissing } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETHEREUM', address: '0xA' }])
    expect(cached('ETHEREUM', '0xA')).toEqual({ usdValue: 6, tokenCount: 1 })
  })

  it('parses hex-encoded balances (0x…)', async () => {
    fetchMock.mockResolvedValue({
      // 0x0de0b6b3a7640000 = 1e18 wei = 1 token at 18 decimals → 2 USD
      result: [{ balance: '0x0de0b6b3a7640000', decimals: 18, price: 2 }],
    })
    const { cached, fetchMissing } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETHEREUM', address: '0xH' }])
    expect(cached('ETHEREUM', '0xH')).toEqual({ usdValue: 2, tokenCount: 1 })
  })

  it('values the native token with the chain price when the response omits it', async () => {
    fetchMock.mockResolvedValue({
      result: [
        {
          balance: '0x0de0b6b3a7640000', // 1 native
          decimals: 18,
          price: null,
          contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        },
      ],
    })
    const { cached, fetchMissing } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETHEREUM', address: '0xN', nativePrice: 3 }])
    expect(cached('ETHEREUM', '0xN')?.usdValue).toBe(3)
  })

  it('refreshOne force-fetches even when already cached, and updates the cache', async () => {
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 7 }] })
    const { cached, fetchMissing, refreshOne } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETH', address: '0x1' }])
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 9 }] })
    await refreshOne({ chainName: 'ETH', address: '0x1' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(cached('ETH', '0x1')?.usdValue).toBe(9)
  })

  it('set seeds a known balance into the cache without fetching', () => {
    const { cached, set } = useAccountBalances()
    set('ETH', '0x5', { usdValue: 42, tokenCount: 3 })
    expect(cached('ETH', '0x5')).toEqual({ usdValue: 42, tokenCount: 3 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('persists the cache to localStorage (keyed by chain + address, lower-cased)', async () => {
    fetchMock.mockResolvedValue({ result: [{ balance: '1', decimals: 0, price: 8 }] })
    const { fetchMissing } = useAccountBalances()
    await fetchMissing([{ chainName: 'ETH', address: '0xAbC' }])
    await nextTick()
    expect(JSON.parse(localStorage.getItem('multiAddressBalances') || '{}')).toEqual({
      'eth:0xabc': { usdValue: 8, tokenCount: 1 },
    })
  })
})
