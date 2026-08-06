import { useChainsStore } from '@/stores/chainsStore'
import {
  useNewListingSwap,
  type ListingSupportedChain,
} from './useNewListingSwap'

export type NewListingCtaKind = 'swap' | 'bridge' | 'none'

export interface NewListingCtaToken {
  symbol: string
  name: string
  // From the overview `newCoins`. Fallback for the real per-token native/available
  // chain split the crypto page uses (nativeChains + chains) until the BE adds it.
  supportedChains?: ListingSupportedChain[]
}

/**
 * Decides a crypto new-listing card's CTA the way the crypto page does
 * (bridge / swap / none), and runs it. Until the overview exposes the token's
 * nativeChains + chains, this approximates with `supportedChains`:
 * - on a swap-capable current chain  -> Swap
 * - not on the current chain but with a swap-capable home chain -> Bridge
 * - otherwise -> no CTA
 */
export function useNewListingCta(): {
  resolve: (token: NewListingCtaToken) => NewListingCtaKind
  run: (token: NewListingCtaToken) => void
} {
  const chainsStore = useChainsStore()
  const { openSwapForToken, openBridgeForToken } = useNewListingSwap()

  const resolve = (token: NewListingCtaToken): NewListingCtaKind => {
    const chains = token.supportedChains ?? []
    if (chains.length === 0) return 'none'
    const current = chainsStore.selectedChain?.name
    const onCurrentChain = chains.some(c => c.chainName === current)
    const hasSwapChain = chains.some(c =>
      chainsStore.chainHasSwapSupport(c.chainName),
    )
    if (!onCurrentChain && hasSwapChain) return 'bridge'
    if (onCurrentChain && chainsStore.currentChainhasSwapSupport) return 'swap'
    return 'none'
  }

  const run = (token: NewListingCtaToken): void => {
    const kind = resolve(token)
    if (kind === 'swap') {
      openSwapForToken(token.symbol, token.name, token.supportedChains)
    } else if (kind === 'bridge') {
      openBridgeForToken(token.symbol, token.name, token.supportedChains)
    }
  }

  return { resolve, run }
}
