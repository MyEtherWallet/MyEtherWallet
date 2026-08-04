import { computed, ref } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { useChainsStore } from '@/stores/chainsStore'
import { useInputStore } from '@/stores/inputStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import type { Chain, GetWebTokenInfo } from '@/mew_api/types'
import type { NewTokenInfo } from '@/composables/useSwap'

/**
 * Minimal per-chain token identity needed to preselect a Swap "to" token.
 * A subset of the `supportedChains` entry shared by the stock-info / token-info
 * responses (and, once the BE adds it, by overview `newCoins`).
 */
export interface ListingSupportedChain {
  chainName: string
  contract: string | null
}

/**
 * Opens the Swap panel with a crypto coin preselected as the "to" token.
 *
 * The Swap drawer matches its "to" token by on-chain contract address. If the
 * overview payload already carries the coin's `supportedChains` (same structure
 * the stocks response uses), we resolve from it directly. Otherwise we fall back
 * to looking the coin up by id on the token-info endpoint (the source
 * ModuleTokenInfo uses) to get its per-chain contract. Either way the address
 * match works whether or not a wallet is connected.
 *
 * If the coin has no swap-supported chain (or the lookup fails) we still open
 * the Swap panel; it just falls back to its own default token.
 */
export function useNewListingSwap(): {
  openSwapForCoin: (
    coinId: string,
    symbol: string,
    name: string,
    supportedChains?: ListingSupportedChain[],
  ) => Promise<void>
} {
  const chainsStore = useChainsStore()
  const { storeSwapValues } = useInputStore()
  const walletMenu = useWalletMenuStore()
  const { useMEWFetch } = useFetchMewApi()

  const coinId = ref('')
  const url = computed(() => `/v1/web/pages/token-info/coins/${coinId.value}`)
  const { data, execute } = useMEWFetch(url, { immediate: false })
    .get()
    .json<GetWebTokenInfo>()

  // Prime inputStore from a known supportedChains list, then open Swap.
  const openSwap = (
    supported: ListingSupportedChain[],
    symbol: string,
    name: string,
  ): void => {
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

  const openSwapForCoin = async (
    id: string,
    symbol: string,
    name: string,
    supportedChains?: ListingSupportedChain[],
  ): Promise<void> => {
    // Prefer chains already in the overview payload; only look the coin up by id
    // when the field is absent from the response.
    if (supportedChains) {
      openSwap(supportedChains, symbol, name)
      return
    }
    try {
      coinId.value = id
      await execute()
      openSwap(data.value?.supportedChains ?? [], symbol, name)
    } catch {
      // fall through — open Swap with its own default token
      walletMenu.openPanel('swap')
    }
  }

  return { openSwapForCoin }
}
