import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { type WalletView } from '@/modules/access/common/walletConfigs'
/**
 * Store to manage the state of the access dialog.
 * It provides methods to open and close the dialog.
 */

interface WC_Wallet {
  walletName: string
  walletIcon: string
  wagmiWalletData?: string
}
export const useAccessStore = defineStore('accessStore', () => {
  const isOpenAccessDialog = ref(false)
  const openAccessDialog = () => {
    isOpenAccessDialog.value = true
  }
  const closeAccessDialog = () => {
    isOpenAccessDialog.value = false
    currentView.value = 'default'
  }

  const currentView = ref<WalletView>('default')
  const setCurrentView = (view: WalletView) => {
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
      console.log('Reset clicked wallet connect')
      setClickedWalletConnect(undefined)
    }
  })

  return {
    isOpenAccessDialog,
    openAccessDialog,
    closeAccessDialog,
    currentView,
    setCurrentView,
    clickedWalletConnect,
    setClickedWalletConnect,
    setWagmiWalletData,
  }
})
