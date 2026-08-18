import { useChainsStore } from '@/stores/chainsStore'
import { useInputStore } from '@/stores/inputStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import type {
  Chain,
  CryptoOverviewChain,
  CryptoOverviewNativeChain,
} from '@/mew_api/types'
import type { NewTokenInfo } from '@/composables/useSwap'

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
    chains?: CryptoOverviewChain[],
    nativeChains?: CryptoOverviewNativeChain[],
  ) => void
  openBridgeForToken: (
    symbol: string,
    name: string,
    nativeChains?: CryptoOverviewNativeChain[],
  ) => void
} {
  const chainsStore = useChainsStore()
  const { storeSwapValues } = useInputStore()
  const walletMenu = useWalletMenuStore()

  const isCurrentNative = (
    nativeChains: CryptoOverviewNativeChain[],
  ): boolean => {
    const current = chainsStore.selectedChain?.name
    return !!current && nativeChains.some(c => c.chainName === current)
  }

  const openSwapForToken = (
    symbol: string,
    name: string,
    chains: CryptoOverviewChain[] = [],
    nativeChains: CryptoOverviewNativeChain[] = [],
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

  // Bridge the coin in from the first native chain that supports swap; the "to"
  // token is that chain's native currency (mirrors ModuleExploreCrypto.bridgeBtn).
  const openBridgeForToken = (
    symbol: string,
    name: string,
    nativeChains: CryptoOverviewNativeChain[] = [],
  ): void => {
    const homeChain = nativeChains.find(c =>
      chainsStore.chainHasSwapSupport(c.chainName),
    )
    const toChain = homeChain
      ? chainsStore.allChains.find(c => c.name === homeChain.chainName)
      : undefined
    if (homeChain && toChain) {
      storeSwapValues({
        fromToken: {} as NewTokenInfo,
        toToken: {
          address: MAIN_TOKEN_CONTRACT,
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
