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
export function useRefreshBalances(): { refreshBalances: () => void } {
  const walletStore = useWalletStore()
  const { wallet, walletAddress } = storeToRefs(walletStore)
  const { setTokens, setIsLoadingBalances } = walletStore

  const refreshBalances = () => {
    if (!walletAddress.value) {
      setIsLoadingBalances(false)
      return
    }
    setIsLoadingBalances(true)
    wallet.value
      ?.getBalance()
      .then(balances => {
        useBalanceHandler(balances, setTokens, setIsLoadingBalances)
      })
      .catch((error: unknown) => {
        if (import.meta.env.DEV) console.error('Balance fetch failed:', error)
        setIsLoadingBalances(false)
      })
  }

  return { refreshBalances }
}
