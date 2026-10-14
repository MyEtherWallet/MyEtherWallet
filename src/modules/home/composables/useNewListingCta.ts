import { useChainsStore } from '@/stores/chainsStore'
import { useNewListingSwap } from './useNewListingSwap'
import type {
  CryptoOverviewChain,
  CryptoOverviewNativeChain,
} from '@/mew_api/types'

export type NewListingCtaKind = 'swap' | 'bridge' | 'none'

export interface NewListingCtaToken {
  symbol: string
  name: string
  // From the overview `newCoins`: `chains` are the chains the coin is a contract
  // on, `nativeChains` the chains it's the native currency of.
  chains?: CryptoOverviewChain[]
  nativeChains?: CryptoOverviewNativeChain[]
}

/**
 * resolve() only reads chain names, so it accepts any shape that carries them
 * (the overview `newCoins`, the watchlist token response, ...). run() still
 * needs the full arrays to hand to the swap/bridge panel.
 */
export interface CtaChainsToken {
  chains?: readonly { chainName: string; contract?: string | null }[]
  nativeChains?: readonly { chainName: string }[]
}

/**
 * Decides a crypto CTA (New Listings card + Home watchlist row) the same way the
 * token-info drawer (ModuleTokenInfo) opens its panel: a coin available on the
 * current chain swaps, one that lives only on other chains bridges. Keeping this
 * in sync with the drawer is the point — the button must advertise the panel the
 * click actually opens. 'none' (no swap-capable chain at all) renders Swap
 * disabled on the cards, so the button is never hidden.
 */
export function useNewListingCta(): {
  resolve: (token: CtaChainsToken) => NewListingCtaKind
  run: (token: NewListingCtaToken) => void
} {
  const chainsStore = useChainsStore()
  const { openSwapForToken, openBridgeForToken } = useNewListingSwap()

  const resolve = (token: CtaChainsToken): NewListingCtaKind => {
    const chains = token.chains ?? []
    const nativeChains = token.nativeChains ?? []
    const current = chainsStore.selectedChain?.name
    if (!current) return 'none'

    // On the current chain → Swap; only on other chains → Bridge. This mirrors
    // the drawer's `supportedChains.find(current) ? swap : bridge` so the CTA
    // label and the panel that opens can't disagree.
    const onCurrentChain =
      chains.some(c => c.chainName === current) ||
      nativeChains.some(c => c.chainName === current)

    if (onCurrentChain) {
      return chainsStore.currentChainhasSwapSupport ? 'swap' : 'none'
    }
    // A contract chain only counts for bridging when it carries the coin's
    // address; without it there's nothing to bridge.
    const hasSwapChain =
      nativeChains.some(c => chainsStore.chainHasSwapSupport(c.chainName)) ||
      chains.some(
        c => c.contract && chainsStore.chainHasSwapSupport(c.chainName),
      )
    return hasSwapChain ? 'bridge' : 'none'
  }

  const run = (token: NewListingCtaToken): void => {
    // Bridge only when the coin lives off the current chain; otherwise open Swap
    // — including the 'none' case, so the CTA always opens a panel like the
    // watchlist table rather than dead-ending.
    if (resolve(token) === 'bridge') {
      openBridgeForToken(
        token.symbol,
        token.name,
        token.nativeChains,
        token.chains,
      )
    } else {
      openSwapForToken(
        token.symbol,
        token.name,
        token.chains,
        token.nativeChains,
      )
    }
  }

  return { resolve, run }
}
