import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type WalletView } from '@/modules/access/common/walletConfigs'
/**
 * Store to manage the state of the access dialog.
 * It provides methods to open and close the dialog.
 */
export const useAccessStore = defineStore('accessStore', () => {
  const isOpenAccessDialog = ref(false)
  const openAccessDialog = () => {
    isOpenAccessDialog.value = true
  }
  const closeAccessDialog = () => {
    isOpenAccessDialog.value = false
  }

  const currentView = ref<WalletView>('default')
  const setCurrentView = (view: WalletView) => {
    currentView.value = view
  }

  return {
    isOpenAccessDialog,
    openAccessDialog,
    closeAccessDialog,
    currentView,
    setCurrentView,
  }
})
