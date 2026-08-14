import { describe, it, expect, vi, beforeEach } from 'vitest'
import type {
  CryptoOverviewChain,
  CryptoOverviewNativeChain,
} from '@/mew_api/types'

// Ethereum is the only swap-supported chain in these tests.
const chainHasSwapSupport = vi.fn((name: string) => name === 'Ethereum')
const allChains = [{ name: 'Ethereum' }, { name: 'Polygon' }]
let selectedChain: { name: string } | undefined = { name: 'Ethereum' }
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    get selectedChain() {
      return selectedChain
    },
    allChains,
    chainHasSwapSupport,
  }),
}))

const storeSwapValues = vi.fn()
vi.mock('@/stores/inputStore', () => ({
  useInputStore: () => ({ storeSwapValues }),
}))

const openPanel = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))

// walletStore pulls in the Ledger module on import; mock to just the sentinel.
vi.mock('@/stores/walletStore', () => ({
  MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
}))

import { useNewListingSwap } from '@/modules/home/composables/useNewListingSwap'

const contract = (
  chainName: string,
  contractAddr: string,
): CryptoOverviewChain => ({
  chainName,
  chainNameLong: chainName,
  chainType: 'EVM',
  chainIconUrl: '',
  contract: contractAddr,
  decimals: 18,
})
const native = (chainName: string): CryptoOverviewNativeChain => ({
  chainName,
  chainNameLong: chainName,
  chainType: 'EVM',
  chainIconUrl: '',
  decimals: 18,
})

describe('useNewListingSwap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    selectedChain = { name: 'Ethereum' }
  })

  it('primes swap with the contract on the selected chain, then opens Swap', () => {
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('BTC', 'Bitcoin', [contract('Ethereum', '0xABC')], [])

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({
          address: '0xABC',
          symbol: 'BTC',
          name: 'Bitcoin',
        }),
        toChain: { name: 'Ethereum' },
      }),
    )
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('uses the native sentinel when the coin is native to the current chain', () => {
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('ETH', 'Ether', [], [native('Ethereum')])

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        }),
        toChain: { name: 'Ethereum' },
      }),
    )
  })

  it('opens Swap without priming when the coin is not a contract on the current chain', () => {
    // Coin lives on Polygon, current chain is Ethereum → no current-chain
    // address to prime with (mirrors the table swapBtn), but Swap still opens.
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('TOK', 'Token', [contract('Polygon', '0x111')], [])

    expect(storeSwapValues).not.toHaveBeenCalled()
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('still opens Swap (without priming) when there are no chains', () => {
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('TOK', 'Token')
    openSwapForToken('TOK', 'Token', [], [])

    expect(storeSwapValues).not.toHaveBeenCalled()
    expect(openPanel).toHaveBeenCalledTimes(2)
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('bridges in from the native swap-capable chain, then opens Bridge', () => {
    const { openBridgeForToken } = useNewListingSwap()
    openBridgeForToken('TOK', 'Token', [native('Ethereum')])

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          symbol: 'TOK',
        }),
        toChain: { name: 'Ethereum' },
      }),
    )
    expect(openPanel).toHaveBeenCalledWith('bridge')
  })
})
