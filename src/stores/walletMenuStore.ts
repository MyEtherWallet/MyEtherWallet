import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWalletMenuStore = defineStore('walletMenuStore', () => {
  const isOpenSideMenu = ref(false)
  /**
   * Current Active panel in the wallet menu
   * 0 - Buy
   * 1 - Sell
   * 2 - Send
   * 3 - Swap
   */
  const walletPanel = ref(3)

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  const setWalletPanel = (value: number) => {
    walletPanel.value = value
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
    walletPanel,
    setWalletPanel,
  }
})
