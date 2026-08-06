import { describe, it, expect, vi, beforeEach } from 'vitest'

// Drive the chain state and avoid pulling in the wallet/Ledger store chain.
const chain = {
  selected: 'Ethereum' as string | undefined,
  currentSwap: true,
  swapSupported: (_name: string) => true,
}
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    selectedChain: chain.selected ? { name: chain.selected } : undefined,
    chainHasSwapSupport: (name: string) => chain.swapSupported(name),
    currentChainhasSwapSupport: chain.currentSwap,
    allChains: [{ name: 'Ethereum' }, { name: 'Solana' }],
  }),
}))
const openSwapForToken = vi.fn()
const openBridgeForToken = vi.fn()
vi.mock('@/modules/home/composables/useNewListingSwap', () => ({
  useNewListingSwap: () => ({ openSwapForToken, openBridgeForToken }),
}))

import { useNewListingCta } from '@/modules/home/composables/useNewListingCta'

const on = (chainName: string) => [{ chainName, contract: '0x' }]

describe('useNewListingCta', () => {
  beforeEach(() => {
    chain.selected = 'Ethereum'
    chain.currentSwap = true
    chain.swapSupported = () => true
    openSwapForToken.mockClear()
    openBridgeForToken.mockClear()
  })

  it("returns 'none' with no supported chains", () => {
    const { resolve } = useNewListingCta()
    expect(resolve({ symbol: 'X', name: 'X', supportedChains: [] })).toBe('none')
    expect(resolve({ symbol: 'X', name: 'X' })).toBe('none')
  })

  it("returns 'swap' on a swap-capable current chain", () => {
    expect(
      useNewListingCta().resolve({ symbol: 'X', name: 'X', supportedChains: on('Ethereum') }),
    ).toBe('swap')
  })

  it("returns 'bridge' when off the current chain but with a swap-capable home chain", () => {
    chain.swapSupported = name => name === 'Solana'
    expect(
      useNewListingCta().resolve({ symbol: 'X', name: 'X', supportedChains: on('Solana') }),
    ).toBe('bridge')
  })

  it("returns 'none' when the coin's chains don't support swap", () => {
    chain.swapSupported = () => false
    expect(
      useNewListingCta().resolve({ symbol: 'X', name: 'X', supportedChains: on('Solana') }),
    ).toBe('none')
  })

  it("returns 'none' on the current chain when swap isn't supported there", () => {
    chain.currentSwap = false
    chain.swapSupported = () => false
    expect(
      useNewListingCta().resolve({ symbol: 'X', name: 'X', supportedChains: on('Ethereum') }),
    ).toBe('none')
  })

  it('run dispatches swap for a swap CTA', () => {
    const token = { symbol: 'X', name: 'X', supportedChains: on('Ethereum') }
    useNewListingCta().run(token)
    expect(openSwapForToken).toHaveBeenCalledWith('X', 'X', token.supportedChains)
    expect(openBridgeForToken).not.toHaveBeenCalled()
  })

  it('run dispatches bridge for a bridge CTA', () => {
    chain.swapSupported = name => name === 'Solana'
    const token = { symbol: 'X', name: 'X', supportedChains: on('Solana') }
    useNewListingCta().run(token)
    expect(openBridgeForToken).toHaveBeenCalledWith('X', 'X', token.supportedChains)
    expect(openSwapForToken).not.toHaveBeenCalled()
  })
})
