import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Chain } from '@/mew_api/types'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import { useChainsStore } from '@/stores/chainsStore'
import { getTradeExplorerLink } from '@/utils/tradeExplorerLink'

const TX_HASH = '0x' + 'cd'.repeat(32)

const chain = (name: string, chainID: string, blockExplorerTX: string) =>
  ({ name, chainID, blockExplorerTX, type: 'EVM' }) as unknown as Chain

describe('getTradeExplorerLink', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('builds the link from the explorer the API declares for the chain', () => {
    useChainsStore().setChainData([
      chain('ETHEREUM', '1', 'https://www.ethvm.com/tx/[[txHash]]'),
      chain('BSC', '56', 'https://bscscan.com/tx/[[txHash]]'),
    ])

    expect(getTradeExplorerLink(1, TX_HASH)).toBe(
      `https://www.ethvm.com/tx/${TX_HASH}`,
    )
    expect(getTradeExplorerLink(56, TX_HASH)).toBe(
      `https://bscscan.com/tx/${TX_HASH}`,
    )
  })

  it('falls back to the provider default while the chains are not loaded', () => {
    expect(getTradeExplorerLink(1, TX_HASH)).toBe(
      `https://etherscan.io/tx/${TX_HASH}`,
    )
  })

  it('returns an empty link without a transaction hash', () => {
    expect(getTradeExplorerLink(1, '')).toBe('')
  })
})
