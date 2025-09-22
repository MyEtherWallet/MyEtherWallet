import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWalletMenuStore = defineStore('walletMenuStore', () => {
  const isOpenSideMenu = ref(false)
  type WalletPanel = 0 | 1 | 2 | 3

  /**
   * Current Active panel in the wallet menu
   * 0 - Buy
   * 1 - Sell
   * 2 - Send
   * 3 - Swap
   */
  const walletPanel = ref<WalletPanel>(3)

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  const setWalletPanel = (value: number) => {
    if (value < 0 || value > 3) {
      throw new Error('Invalid wallet panel')
    }
    walletPanel.value = value as WalletPanel
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
    walletPanel,
    setWalletPanel,
  }
})
