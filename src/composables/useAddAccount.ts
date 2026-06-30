// src/composables/useAddAccount.ts
import { watch, toRef } from 'vue'
import { useAccessStore } from '@/stores/accessStore'
import { useWalletStore } from '@/stores/walletStore'
import { useSavedAccountsStore } from '@/stores/savedAccountsStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { SAVED_ACCOUNTS_CAP } from '@/stores/saved_accounts/savedAccountsLogic'

export function useAddAccount() {
  const accessStore = useAccessStore()
  const walletStore = useWalletStore()
  const savedAccountsStore = useSavedAccountsStore()
  const toastStore = useToastStore()

  const startAdd = (): void => {
    const walletAddress = toRef(walletStore, 'walletAddress')
    const previous = walletAddress.value
    accessStore.openAccessDialog()

    const stop = watch(walletAddress, newAddress => {
      if (!newAddress || newAddress === previous) return
      stop()
      const account = savedAccountsStore.captureActiveAccount()
      if (!account) return
      const res = savedAccountsStore.addAccount(account)
      if (!res.added && res.reason === 'cap') {
        toastStore.addToastMessage({
          text: 'Address limit reached',
          textSecondary: `You can save up to ${SAVED_ACCOUNTS_CAP} addresses.`,
          type: ToastType.Error,
        })
      }
    })
  }

  return { startAdd }
}
