import { ref } from 'vue'
import { defineStore } from 'pinia'

export type WalletPanel = 'trade' | 'swap' | 'send' | 'buy' | 'sell' | 'bridge'

export const useWalletMenuStore = defineStore('walletMenuStore', () => {
  const hasShadow = ref(true)
  const isOpenSideMenu = ref(false)

  const walletPanel = ref<WalletPanel>('swap')

  // Selected token symbol for Trade module (set from stocks view)
  const selectedTradeTokenSymbol = ref<string | null>(null)

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  const setWalletPanel = (value: WalletPanel) => {
    walletPanel.value = value
  }

  const setSelectedTradeTokenSymbol = (symbol: string | null) => {
    selectedTradeTokenSymbol.value = symbol
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
    walletPanel,
    setWalletPanel,
    hasShadow,
    selectedTradeTokenSymbol,
    setSelectedTradeTokenSymbol,
  }
})
