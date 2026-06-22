import { ref } from 'vue'
import { defineStore } from 'pinia'

export type WalletPanel = 'trade' | 'swap' | 'send' | 'bridge' | 'purchase'

export const useWalletMenuStore = defineStore('walletMenuStore', () => {
  const hideLowBalance = ref(false)
  const hasShadow = ref(true)
  const isOpenSideMenu = ref(false)

  const walletPanel = ref<WalletPanel>('swap')

  // Selected token symbol for Trade module (set from stocks view)
  const selectedTradeTokenSymbol = ref<string | null>(null)

  // Coingecko id of the token to pre-populate in the Buy module (set from the
  // crypto/balance tables). Consumed and cleared by ModuleBuy.
  const selectedPurchaseCoinId = ref<string | null>(null)

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  const setWalletPanel = (value: WalletPanel) => {
    walletPanel.value = value
  }

  const openPanel = (panel: WalletPanel) => {
    walletPanel.value = panel
    isOpenSideMenu.value = true
  }

  const setSelectedTradeTokenSymbol = (symbol: string | null) => {
    selectedTradeTokenSymbol.value = symbol
  }

  const setSelectedPurchaseCoinId = (coinId: string | null) => {
    selectedPurchaseCoinId.value = coinId
  }

  const toggleShowBalance = () => {
    hideLowBalance.value = !hideLowBalance.value
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
    walletPanel,
    setWalletPanel,
    openPanel,
    hasShadow,
    selectedTradeTokenSymbol,
    setSelectedTradeTokenSymbol,
    selectedPurchaseCoinId,
    setSelectedPurchaseCoinId,
    hideLowBalance,
    toggleShowBalance,
  }
})
