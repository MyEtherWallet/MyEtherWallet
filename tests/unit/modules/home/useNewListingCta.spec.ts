import { describe, it, expect, vi, beforeEach } from 'vitest'
import type {
  CryptoOverviewChain,
  CryptoOverviewNativeChain,
} from '@/mew_api/types'

// Drive the chain state and avoid pulling in the wallet/Ledger store chain.
const chain: {
  selected: string | undefined
  currentSwap: boolean
  swapSupported: (name: string) => boolean
} = {
  selected: 'Ethereum',
  currentSwap: true,
  swapSupported: () => true,
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

// A contract chain (coin lives as a token there) and a native chain (coin is
// the chain's own currency there) — the two arrays the table CTA keys off.
const contractOn = (chainName: string): CryptoOverviewChain[] => [
  {
    chainName,
    chainNameLong: chainName,
    chainType: 'EVM',
    chainIconUrl: '',
    contract: '0x',
    decimals: 18,
  },
]
const nativeOn = (chainName: string): CryptoOverviewNativeChain[] => [
  {
    chainName,
    chainNameLong: chainName,
    chainType: 'EVM',
    chainIconUrl: '',
    decimals: 18,
  },
]

describe('useNewListingCta', () => {
  beforeEach(() => {
    chain.selected = 'Ethereum'
    chain.currentSwap = true
    chain.swapSupported = () => true
    openSwapForToken.mockClear()
    openBridgeForToken.mockClear()
  })

  it("returns 'none' with no chains", () => {
    const { resolve } = useNewListingCta()
    expect(
      resolve({ symbol: 'X', name: 'X', chains: [], nativeChains: [] }),
    ).toBe('none')
    expect(resolve({ symbol: 'X', name: 'X' })).toBe('none')
  })

  it("returns 'swap' when the coin is a contract on the current chain", () => {
    expect(
      useNewListingCta().resolve({
        symbol: 'X',
        name: 'X',
        chains: contractOn('Ethereum'),
      }),
    ).toBe('swap')
  })

  it("returns 'swap' when the coin is native to the current chain", () => {
    expect(
      useNewListingCta().resolve({
        symbol: 'X',
        name: 'X',
        chains: [],
        nativeChains: nativeOn('Ethereum'),
      }),
    ).toBe('swap')
  })

  it("returns 'bridge' when native to another swap-capable chain, not on the current one", () => {
    chain.swapSupported = name => name === 'Solana'
    expect(
      useNewListingCta().resolve({
        symbol: 'X',
        name: 'X',
        chains: [],
        nativeChains: nativeOn('Solana'),
      }),
    ).toBe('bridge')
  })

  it("returns 'none' when the native chain doesn't support swap", () => {
    chain.swapSupported = () => false
    expect(
      useNewListingCta().resolve({
        symbol: 'X',
        name: 'X',
        chains: [],
        nativeChains: nativeOn('Solana'),
      }),
    ).toBe('none')
  })

  it("returns 'none' on the current chain when swap isn't supported there", () => {
    chain.currentSwap = false
    chain.swapSupported = () => false
    expect(
      useNewListingCta().resolve({
        symbol: 'X',
        name: 'X',
        chains: contractOn('Ethereum'),
      }),
    ).toBe('none')
  })

  it('run dispatches swap for a swap CTA, forwarding both chain arrays', () => {
    const token = {
      symbol: 'X',
      name: 'X',
      chains: contractOn('Ethereum'),
      nativeChains: [],
    }
    useNewListingCta().run(token)
    expect(openSwapForToken).toHaveBeenCalledWith(
      'X',
      'X',
      token.chains,
      token.nativeChains,
    )
    expect(openBridgeForToken).not.toHaveBeenCalled()
  })

  it('run dispatches bridge for a bridge CTA', () => {
    chain.swapSupported = name => name === 'Solana'
    const token = {
      symbol: 'X',
      name: 'X',
      chains: [],
      nativeChains: nativeOn('Solana'),
    }
    useNewListingCta().run(token)
    expect(openBridgeForToken).toHaveBeenCalledWith(
      'X',
      'X',
      token.nativeChains,
    )
    expect(openSwapForToken).not.toHaveBeenCalled()
  })
})
