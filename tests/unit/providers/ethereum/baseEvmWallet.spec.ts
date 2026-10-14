import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { SignableTransactionParams } from '@/providers/common/types'

// Mock the network layer so we can assert whether a request was issued at all.
const fetchWithRetryMock = vi.fn()
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: (...args: unknown[]) => fetchWithRetryMock(...args),
}))

// Importing the wallet transitively pulls in the store layer, which reaches the
// analytics module and its hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/analytics', () => ({ analytics: {} }))

import BaseEvmWallet from '@/providers/ethereum/baseEvmWallet'

const params = (quoteId: string): SignableTransactionParams =>
  ({ quoteId, priority: 'REGULAR' }) as unknown as SignableTransactionParams

describe('BaseEvmWallet — empty quoteId guard (MEW-2110)', () => {
  beforeEach(() => fetchWithRetryMock.mockReset())

  it('getMultipleSignableTransactions throws and does NOT hit the API when quoteId is empty', async () => {
    const wallet = new BaseEvmWallet('1')
    await expect(
      wallet.getMultipleSignableTransactions(params('')),
    ).rejects.toThrow()
    // The bug: an empty quoteId builds `…/multi-quotes//unsigned` -> ROUTE_NOT_FOUND.
    expect(fetchWithRetryMock).not.toHaveBeenCalled()
  })

  it('getSignableTransaction throws and does NOT hit the API when quoteId is empty', async () => {
    const wallet = new BaseEvmWallet('1')
    await expect(
      wallet.getSignableTransaction(params('')),
    ).rejects.toThrow()
    expect(fetchWithRetryMock).not.toHaveBeenCalled()
  })

  it('getMultipleSignableTransactions requests the unsigned tx when quoteId is present', async () => {
    fetchWithRetryMock.mockResolvedValue({ serialized: [] })
    const wallet = new BaseEvmWallet('1')
    await wallet.getMultipleSignableTransactions(params('019fd336-5140-777d-ab1a-02c6e895f0de'))
    expect(fetchWithRetryMock).toHaveBeenCalledTimes(1)
    expect(fetchWithRetryMock).toHaveBeenCalledWith(
      expect.stringContaining(
        '/multi-quotes/019fd336-5140-777d-ab1a-02c6e895f0de/unsigned',
      ),
    )
  })
})
