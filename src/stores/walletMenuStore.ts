import { ref } from 'vue'
import { defineStore } from 'pinia'

export type WalletPanel =
  | 'trade'
  | 'swap'
  | 'send'
  | 'buy'
  | 'sell'
  | 'bridge'
  | 'perps'

export const useWalletMenuStore = defineStore('walletMenuStore', () => {
  const hideLowBalance = ref(false)
  const hasShadow = ref(true)
  const isOpenSideMenu = ref(false)

  const walletPanel = ref<WalletPanel>('swap')

  // Selected token symbol for Trade module (set from stocks view)
  const selectedTradeTokenSymbol = ref<string | null>(null)
  const selectedTradeOrderSide = ref<'buy' | 'sell' | null>(null)
  const selectedTradeManageMode = ref<'add' | 'close' | undefined>('add')

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  const setWalletPanel = (value: WalletPanel) => {
    walletPanel.value = value
  }

  const setSelectedTradeTokenSymbol = (symbol: string | null) => {
    selectedTradeTokenSymbol.value = symbol
  }

  const setSelectedTradeOrderSide = (side: 'buy' | 'sell' | null) => {
    selectedTradeOrderSide.value = side
  }

  const setSelectedTradeManageMode = (mode: 'add' | 'close' | undefined) => {
    selectedTradeManageMode.value = mode
  }
  const toggleShowBalance = () => {
    hideLowBalance.value = !hideLowBalance.value
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
    walletPanel,
    setWalletPanel,
    hasShadow,
    selectedTradeTokenSymbol,
    setSelectedTradeTokenSymbol,
    selectedTradeOrderSide,
    setSelectedTradeOrderSide,
    selectedTradeManageMode,
    setSelectedTradeManageMode,
    hideLowBalance,
    toggleShowBalance,
  }
})
