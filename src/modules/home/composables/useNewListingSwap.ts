import { useChainsStore } from '@/stores/chainsStore'
import { useInputStore } from '@/stores/inputStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import type { Chain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/composables/useSwap'

/**
 * Minimal per-chain token identity needed to preselect a Swap "to" token.
 * A subset of the `supportedChains` entry the overview `newCoins` payload
 * carries (same structure as the stocks response).
 */
export interface ListingSupportedChain {
  chainName: string
  contract: string | null
}

/**
 * Opens the Swap panel with a crypto coin preselected as the "to" token.
 *
 * The Swap drawer matches its "to" token by on-chain contract address, so we
 * prime inputStore from the coin's `supportedChains` (from the overview payload)
 * before opening — the address match works whether or not a wallet is connected.
 * If the coin has no swap-supported chain we still open Swap; it just falls back
 * to its own default token.
 */
export function useNewListingSwap(): {
  openSwapForToken: (
    symbol: string,
    name: string,
    supportedChains?: ListingSupportedChain[],
  ) => void
  openBridgeForToken: (
    symbol: string,
    name: string,
    supportedChains?: ListingSupportedChain[],
  ) => void
} {
  const chainsStore = useChainsStore()
  const { storeSwapValues } = useInputStore()
  const walletMenu = useWalletMenuStore()

  const openSwapForToken = (
    symbol: string,
    name: string,
    supportedChains?: ListingSupportedChain[],
  ): void => {
    const supported = supportedChains ?? []
    // Prefer the currently selected chain when it's swap-capable, otherwise the
    // first swap-supported chain the token lives on.
    const current = chainsStore.selectedChain?.name
    const chain =
      supported.find(
        c =>
          c.chainName === current &&
          chainsStore.chainHasSwapSupport(c.chainName),
      ) ?? supported.find(c => chainsStore.chainHasSwapSupport(c.chainName))
    const toChain = chain
      ? chainsStore.allChains.find(c => c.name === chain.chainName)
      : undefined
    if (chain && toChain) {
      storeSwapValues({
        fromToken: {} as NewTokenInfo,
        toToken: {
          address: chain.contract ?? MAIN_TOKEN_CONTRACT,
          symbol,
          name,
          decimals: 18,
        } as NewTokenInfo,
        fromAmount: '',
        toChain: toChain as Chain,
      })
    }
    walletMenu.openPanel('swap')
  }

  // Bridge the coin in from its home chain (the first swap-supported chain it
  // lives on). Mirrors ModuleExploreCrypto's bridgeBtn: the "to" token is the
  // native token of that chain so the bridge opens targeting it.
  const openBridgeForToken = (
    symbol: string,
    name: string,
    supportedChains?: ListingSupportedChain[],
  ): void => {
    const supported = supportedChains ?? []
    const chain = supported.find(c =>
      chainsStore.chainHasSwapSupport(c.chainName),
    )
    const toChain = chain
      ? chainsStore.allChains.find(c => c.name === chain.chainName)
      : undefined
    if (chain && toChain) {
      storeSwapValues({
        fromToken: {} as NewTokenInfo,
        toToken: {
          address: MAIN_TOKEN_CONTRACT,
          symbol,
          name,
          decimals: 18,
        } as NewTokenInfo,
        fromAmount: '',
        toChain: toChain as Chain,
      })
    }
    walletMenu.openPanel('bridge')
  }

  return { openSwapForToken, openBridgeForToken }
}
