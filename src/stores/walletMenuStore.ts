import { ref } from 'vue'
import { defineStore } from 'pinia'

export type WalletPanel = 'swap' | 'send' | 'buy' | 'sell' | 'bridge'

export const useWalletMenuStore = defineStore('walletMenuStore', () => {
  const hasShadow = ref(true)
  const isOpenSideMenu = ref(false)

  const walletPanel = ref<WalletPanel>('swap')

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  const setWalletPanel = (value: WalletPanel) => {
    walletPanel.value = value
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
    walletPanel,
    setWalletPanel,
    hasShadow,
  }
})
