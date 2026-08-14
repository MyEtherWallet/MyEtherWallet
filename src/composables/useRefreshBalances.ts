import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'
import useBalanceHandler from '@/utils/balanceHandler'

/**
 * Re-fetch the connected wallet's balances on demand (the "refresh" affordance
 * on portfolio surfaces). Mirrors the fetch in App.vue / AppWalletCard.
 *
 * ponytail: this fetch is currently duplicated across App.vue, AppWalletCard
 * and here — see FOLLOWUPS.md for the consolidation follow-up. Kept a thin
 * standalone composable rather than refactoring those two out of ticket scope.
 */
export interface RefreshBalancesOptions {
  /**
   * Skip toggling the shared `isLoadingBalances` flag so the refetch happens
   * in place with no loading/skeleton flash. Used by the Hero card's 2-minute
   * background poll ("updates every 2 min").
   */
  silent?: boolean
}

export function useRefreshBalances(): {
  refreshBalances: (options?: RefreshBalancesOptions) => void
} {
  const walletStore = useWalletStore()
  const { wallet, walletAddress } = storeToRefs(walletStore)
  const { setTokens, setIsLoadingBalances } = walletStore

  const noop = () => {}

  const refreshBalances = ({ silent = false }: RefreshBalancesOptions = {}) => {
    if (!walletAddress.value) {
      if (!silent) setIsLoadingBalances(false)
      return
    }
    if (!silent) setIsLoadingBalances(true)
    wallet.value
      ?.getBalance()
      .then(balances => {
        useBalanceHandler(
          balances,
          setTokens,
          silent ? noop : setIsLoadingBalances,
        )
      })
      .catch((error: unknown) => {
        if (import.meta.env.DEV) console.error('Balance fetch failed:', error)
        if (!silent) setIsLoadingBalances(false)
      })
  }

  return { refreshBalances }
}
