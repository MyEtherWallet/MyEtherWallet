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
 * Decides a crypto new-listing card's CTA exactly the way the crypto table does
 * (ModuleExploreCrypto): bridge takes priority over swap, and the same
 * getTokenIsCurrentNative / getIsBridgeable rules key off `nativeChains` +
 * `chains`. Cards render Swap disabled on 'none' (see HomeNewListings), so the
 * button is never hidden.
 */
export function useNewListingCta(): {
  resolve: (token: NewListingCtaToken) => NewListingCtaKind
  run: (token: NewListingCtaToken) => void
} {
  const chainsStore = useChainsStore()
  const { openSwapForToken, openBridgeForToken } = useNewListingSwap()

  const resolve = (token: NewListingCtaToken): NewListingCtaKind => {
    const chains = token.chains ?? []
    const nativeChains = token.nativeChains ?? []
    const current = chainsStore.selectedChain?.name

    const isNative = nativeChains.length > 0
    const isCurrentNative =
      !!current && nativeChains.some(c => c.chainName === current)
    const availableOnCurrent =
      !!current && chains.some(c => c.chainName === current)
    const hasSwapNativeChain = nativeChains.some(c =>
      chainsStore.chainHasSwapSupport(c.chainName),
    )

    // Bridge wins over swap, mirroring the table's v-if / v-else-if order.
    if (
      isNative &&
      !isCurrentNative &&
      !availableOnCurrent &&
      hasSwapNativeChain
    )
      return 'bridge'
    if (
      chainsStore.currentChainhasSwapSupport &&
      (chains.length > 0 || isCurrentNative)
    )
      return 'swap'
    return 'none'
  }

  const run = (token: NewListingCtaToken): void => {
    const kind = resolve(token)
    if (kind === 'swap') {
      openSwapForToken(
        token.symbol,
        token.name,
        token.chains,
        token.nativeChains,
      )
    } else if (kind === 'bridge') {
      openBridgeForToken(token.symbol, token.name, token.nativeChains)
    }
  }

  return { resolve, run }
}
