import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { type CreateWalletView } from '@/modules/access/common/walletConfigs'
/**
 * Store to manage the state of the access dialog.
 * It provides methods to open and close the dialog.
 */

interface WC_Wallet {
  walletName: string
  walletIcon: string
  wagmiWalletData?: string
}
export const useCreateStore = defineStore('createStore', () => {
  const isOpenCreateDialog = ref(false)
  const openCreateDialog = () => {
    isOpenCreateDialog.value = true
  }
  const closeCreateDialog = () => {
    isOpenCreateDialog.value = false
    currentView.value = 'default'
  }

  const currentView = ref<CreateWalletView>('default')
  const setCurrentView = (view: CreateWalletView) => {
    currentView.value = view
  }

  const clickedWalletConnect = ref<undefined | WC_Wallet>(undefined)
  const setClickedWalletConnect = (value: WC_Wallet | undefined) => {
    clickedWalletConnect.value = value
  }
  const setWagmiWalletData = (data: string) => {
    if (clickedWalletConnect.value) {
      clickedWalletConnect.value.wagmiWalletData = data
    }
  }

  watch(currentView, newView => {
    if (newView === 'default') {
      setClickedWalletConnect(undefined)
    }
  })

  return {
    isOpenCreateDialog,
    openCreateDialog,
    closeCreateDialog,
    currentView,
    setCurrentView,
    clickedWalletConnect,
    setClickedWalletConnect,
    setWagmiWalletData,
  }
})
