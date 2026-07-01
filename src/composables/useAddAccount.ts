// src/composables/useAddAccount.ts
import { useAccessStore } from '@/stores/accessStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { SAVED_ACCOUNTS_CAP } from '@/stores/saved_accounts/savedAccountsLogic'

export function useAddAccount() {
  const accessStore = useAccessStore()
  const watchOnlyStore = useWatchOnlyStore()
  const toastStore = useToastStore()

  /**
   * Adding is just opening the existing connect flow: on success the wallet's
   * setAddress() persists the new address into watchOnlyStore (capped, named).
   * We only guard the cap up-front.
   */
  const startAdd = (): void => {
    if (watchOnlyStore.isAtCap) {
      toastStore.addToastMessage({
        text: 'Address limit reached',
        textSecondary: `You can save up to ${SAVED_ACCOUNTS_CAP} addresses.`,
        type: ToastType.Error,
      })
      return
    }
    accessStore.openAccessDialog()
  }

  return { startAdd }
}
