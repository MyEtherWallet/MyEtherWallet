// tests/unit/composables/useAccountBalances.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const fetchMock = vi.fn()
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: (...args: unknown[]) => fetchMock(...args),
}))

import { useAccountBalances } from '@/composables/useAccountBalances'

describe('useAccountBalances', () => {
  beforeEach(() => fetchMock.mockReset())

  it('fetches by address and reduces to usdValue + tokenCount', async () => {
    fetchMock.mockResolvedValue({
      result: [
        { balance: '2', decimals: 0, price: 3 }, // 6 USD
        { balance: '0', decimals: 0, price: 100 }, // zero balance, ignored in count
        { balance: '1', decimals: 0, price: 4 }, // 4 USD
      ],
    })
    const { balances, fetchFor, isLoading } = useAccountBalances()
    await fetchFor([{ id: 'EVM:0x1', chainName: 'ETHEREUM', address: '0x1' }])
    expect(fetchMock).toHaveBeenCalledWith(
      '/balances/ETHEREUM/0x1/?noInjectErrors=false&sparklines=true',
    )
    expect(balances.value['EVM:0x1'].usdValue).toBe(10)
    expect(balances.value['EVM:0x1'].tokenCount).toBe(2)
    expect(isLoading.value).toBe(false)
  })

  it('records a zero balance on fetch error without throwing', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network'))
    const { balances, fetchFor } = useAccountBalances()
    await fetchFor([{ id: 'EVM:0x9', chainName: 'ETHEREUM', address: '0x9' }])
    expect(balances.value['EVM:0x9']).toEqual({ usdValue: 0, tokenCount: 0 })
  })
})
