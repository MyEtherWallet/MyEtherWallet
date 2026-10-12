import { describe, it, expect, vi, beforeEach } from 'vitest'

const fetchMock = vi.fn()
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: (...args: unknown[]) => fetchMock(...args),
}))

import {
  fetchNativeBalances,
  formatNativeBalance,
  chunk,
  NATIVE_BALANCE_BATCH_SIZE,
} from '@/composables/useNativeBalances'

const ETH = { name: 'ETHEREUM', type: 'EVM', chainID: '1' }
const BTC = { name: 'BITCOIN', type: 'BITCOIN' }

beforeEach(() => fetchMock.mockReset())

/**
 * The per-address `/balances/{chain}/{address}` endpoint is rate limited and
 * returns the full token list; address pickers and saved-address lists only
 * need the native balance, so they go through the batch endpoints instead —
 * one request per 10 addresses.
 */
describe('fetchNativeBalances', () => {
  it('fetches a page of EVM addresses with one batch request and maps by lower-cased address', async () => {
    fetchMock.mockResolvedValue([
      { address: '0xAAA', value: '0x0de0b6b3a7640000' }, // 1 ETH, hex
      { address: '0xbbb', value: '2000000000000000000' }, // 2 ETH, decimal
    ])
    const result = await fetchNativeBalances(ETH, ['0xaaa', '0xBBB', '0xccc'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/v1/evm/chains/1/balances?addresses=0xaaa,0xBBB,0xccc',
    )
    expect(result.get('0xaaa')).toBe(10n ** 18n)
    expect(result.get('0xbbb')).toBe(2n * 10n ** 18n)
    expect(result.has('0xccc')).toBe(false) // not returned → absent, caller decides
  })

  it('routes Bitcoin chains to the BTC batch endpoint and reads nativeValue', async () => {
    fetchMock.mockResolvedValue([
      {
        address: 'bc1qabc',
        balance: { nativeValue: '150000000', nativeSymbol: 'BTC' },
      },
    ])
    const result = await fetchNativeBalances(BTC, ['bc1qabc'])
    expect(fetchMock).toHaveBeenCalledWith(
      '/v1/btc/BITCOIN/balances?addresses=bc1qabc',
    )
    expect(result.get('bc1qabc')).toBe(150_000_000n)
  })

  it('splits more than 10 addresses into sequential requests of at most 10', async () => {
    fetchMock.mockResolvedValue([])
    const addresses = Array.from({ length: 23 }, (_, i) => `0x${i}`)
    await fetchNativeBalances(ETH, addresses)
    expect(fetchMock).toHaveBeenCalledTimes(3)
    const sizes = fetchMock.mock.calls.map(
      c => (c[0] as string).split('addresses=')[1].split(',').length,
    )
    expect(sizes).toEqual([10, 10, 3])
    expect(NATIVE_BALANCE_BATCH_SIZE).toBe(10)
  })

  it('dedupes addresses and makes no request for an empty list', async () => {
    fetchMock.mockResolvedValue([{ address: '0x1', value: '0x1' }])
    await fetchNativeBalances(ETH, ['0x1', '0x1', ''])
    expect(fetchMock).toHaveBeenCalledWith(
      '/v1/evm/chains/1/balances?addresses=0x1',
    )
    fetchMock.mockClear()
    expect(await fetchNativeBalances(ETH, [])).toEqual(new Map())
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('treats a malformed balance as zero and rejects when a request fails', async () => {
    fetchMock.mockResolvedValueOnce([{ address: '0x1', value: 'N/A' }])
    expect((await fetchNativeBalances(ETH, ['0x1'])).get('0x1')).toBe(0n)

    fetchMock.mockRejectedValueOnce(new Error('429'))
    await expect(fetchNativeBalances(ETH, ['0x1'])).rejects.toThrow('429')
  })

  it('refuses an EVM chain without a chain id instead of hitting a malformed URL', async () => {
    await expect(
      fetchNativeBalances({ name: 'ETHEREUM', type: 'EVM' }, ['0x1']),
    ).rejects.toThrow(/chainID/)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('formatNativeBalance / chunk', () => {
  it('formats wei as ETH and sats as BTC', () => {
    expect(formatNativeBalance(1_500_000_000_000_000_000n, 'EVM')).toBe('1.5')
    expect(formatNativeBalance(150_000_000n, 'BITCOIN')).toBe('1.5')
  })
  it('chunks evenly and keeps order', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(chunk([], 2)).toEqual([])
  })
})
