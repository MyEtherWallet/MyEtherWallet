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
    const isOpen = toRef(accessStore, 'isOpenAccessDialog')
    const previous = walletAddress.value
    let finished = false
    let stopAddr: () => void = () => {}
    let stopDialog: () => void = () => {}

    const finish = (): void => {
      if (finished) return
      finished = true
      stopAddr()
      stopDialog()
    }

    accessStore.openAccessDialog()

    stopAddr = watch(walletAddress, newAddress => {
      if (finished) return
      if (!newAddress || newAddress === previous) return
      finish()
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

    stopDialog = watch(isOpen, open => {
      if (finished) return
      // dialog closed without a new address → user cancelled; tear down so a
      // later unrelated address change can't trigger a phantom add.
      if (!open && walletAddress.value === previous) finish()
    })
  }

  return { startAdd }
}
