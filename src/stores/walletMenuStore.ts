import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWalletMenuStore = defineStore('walletMenuStore', () => {
  const isOpenSideMenu = ref(false)
  const walletPanel = ref(0)

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
