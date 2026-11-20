import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { WalletType } from '@/providers/types'
import { useAuthStore } from '@/stores/authStore'
import { useWalletStore } from '@/stores/walletStore'

/**
 * The Privy (Google / email) account, while its wallet is the connected one.
 *
 * The wallet type alone does not say that. A saved Privy address that is only
 * being viewed is a watch-only wallet that keeps its saved type, and the login
 * outlives a switch to another saved account. So `email` and `loginMethod`
 * are null unless the connected, signing wallet is the Privy one: nothing that
 * reads them can put this login's email over another account's address.
 */
export const usePrivyAccount = () => {
  const { wallet, isWatchOnly } = storeToRefs(useWalletStore())
  const { email, loginMethod } = storeToRefs(useAuthStore())

  const isPrivyConnected = computed(
    () =>
      !isWatchOnly.value && wallet.value?.getWalletType() === WalletType.PRIVY,
  )

  return {
    isPrivyConnected,
    email: computed(() => (isPrivyConnected.value ? email.value : null)),
    loginMethod: computed(() =>
      isPrivyConnected.value ? loginMethod.value : null,
    ),
  }
}
