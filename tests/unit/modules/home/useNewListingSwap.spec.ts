import { describe, it, expect, vi, beforeEach } from 'vitest'

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

describe('useNewListingSwap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    selectedChain = { name: 'Ethereum' }
  })

  it('primes swap with the contract on the selected chain, then opens Swap', async () => {
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('BTC', 'Bitcoin', [
      { chainName: 'Ethereum', contract: '0xABC' },
    ])

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

  it('uses the native sentinel when the chain contract is null', () => {
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('ETH', 'Ether', [{ chainName: 'Ethereum', contract: null }])

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({
          address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        }),
      }),
    )
  })

  it('falls back to the first swap-supported chain when the selected one is not', () => {
    selectedChain = { name: 'Polygon' } // not swap-supported here
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('TOK', 'Token', [
      { chainName: 'Polygon', contract: '0x111' },
      { chainName: 'Ethereum', contract: '0x222' },
    ])

    expect(storeSwapValues).toHaveBeenCalledWith(
      expect.objectContaining({
        toToken: expect.objectContaining({ address: '0x222' }),
        toChain: { name: 'Ethereum' },
      }),
    )
  })

  it('still opens Swap (without priming) when no chain supports swap', () => {
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('TOK', 'Token', [{ chainName: 'Polygon', contract: '0x111' }])

    expect(storeSwapValues).not.toHaveBeenCalled()
    expect(openPanel).toHaveBeenCalledWith('swap')
  })

  it('still opens Swap when supportedChains is missing or empty', () => {
    const { openSwapForToken } = useNewListingSwap()
    openSwapForToken('TOK', 'Token')
    openSwapForToken('TOK', 'Token', [])

    expect(storeSwapValues).not.toHaveBeenCalled()
    expect(openPanel).toHaveBeenCalledTimes(2)
    expect(openPanel).toHaveBeenCalledWith('swap')
  })
})
