import { useChainsStore } from '@/stores/chainsStore'
import { useInputStore } from '@/stores/inputStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import type { Chain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/stores/swapStore'

/**
 * The helpers only read chainName + contract + decimals, so they accept any
 * chain shape carrying them: the overview `newCoins` (contract chains) or the
 * watchlist token response mapped to it.
 */
export interface SwapChain {
  chainName: string
  contract?: string | null
  decimals?: number | null
}
export interface SwapNativeChain {
  chainName: string
  decimals?: number | null
}

/**
 * Opens Swap / Bridge for a crypto new-listing coin, mirroring the crypto
 * table's swapBtn / bridgeBtn (ModuleExploreCrypto) off the same `chains`
 * (contract chains) + `nativeChains` (native-currency chains) split the
 * overview `newCoins` payload now carries.
 *
 * The Swap drawer matches its "to" token by on-chain contract, so we prime
 * inputStore before opening; the address match works with or without a wallet.
 */
export function useNewListingSwap(): {
  openSwapForToken: (
    symbol: string,
    name: string,
    chains?: SwapChain[],
    nativeChains?: SwapNativeChain[],
  ) => void
  openBridgeForToken: (
    symbol: string,
    name: string,
    nativeChains?: SwapNativeChain[],
    chains?: SwapChain[],
  ) => void
} {
  const chainsStore = useChainsStore()
  const { storeSwapValues } = useInputStore()
  const walletMenu = useWalletMenuStore()

  const isCurrentNative = (nativeChains: SwapNativeChain[]): boolean => {
    const current = chainsStore.selectedChain?.name
    return !!current && nativeChains.some(c => c.chainName === current)
  }

  const openSwapForToken = (
    symbol: string,
    name: string,
    chains: SwapChain[] = [],
    nativeChains: SwapNativeChain[] = [],
  ): void => {
    const current = chainsStore.selectedChain?.name
    // On a native chain the "to" token is the chain's own currency; otherwise
    // it's the coin's contract on the current (or first available) chain.
    const native = isCurrentNative(nativeChains)
    const pool = native ? nativeChains : chains
    const address = native
      ? MAIN_TOKEN_CONTRACT
      : chains.find(c => c.chainName === current)?.contract || ''
    const tokenOnChain = pool.find(c => c.chainName === current) ?? pool[0]
    const toChain = tokenOnChain
      ? chainsStore.allChains.find(c => c.name === tokenOnChain.chainName)
      : undefined
    if (address && tokenOnChain && toChain) {
      storeSwapValues({
        fromToken: {} as NewTokenInfo,
        toToken: {
          address,
          symbol,
          name,
          decimals: tokenOnChain.decimals ?? 18,
        } as NewTokenInfo,
        fromAmount: '',
        toChain: toChain as Chain,
      })
    }
    walletMenu.openPanel('swap')
  }

  // Bridge the coin in from the first swap-capable chain. Prefer a native chain
  // (the "to" token is that chain's native currency); fall back to a swap-capable
  // contract chain so contract-only coins still preselect a destination + token.
  const openBridgeForToken = (
    symbol: string,
    name: string,
    nativeChains: SwapNativeChain[] = [],
    chains: SwapChain[] = [],
  ): void => {
    const nativeHome = nativeChains.find(c =>
      chainsStore.chainHasSwapSupport(c.chainName),
    )
    const contractHome = chains.find(c =>
      chainsStore.chainHasSwapSupport(c.chainName),
    )
    const homeChain = nativeHome ?? contractHome
    const toChain = homeChain
      ? chainsStore.allChains.find(c => c.name === homeChain.chainName)
      : undefined
    if (homeChain && toChain) {
      storeSwapValues({
        fromToken: {} as NewTokenInfo,
        toToken: {
          address: nativeHome
            ? MAIN_TOKEN_CONTRACT
            : contractHome?.contract || MAIN_TOKEN_CONTRACT,
          symbol,
          name,
          decimals: homeChain.decimals ?? 18,
        } as NewTokenInfo,
        fromAmount: '',
        toChain: toChain as Chain,
      })
    }
    walletMenu.openPanel('bridge')
  }

  return { openSwapForToken, openBridgeForToken }
}
