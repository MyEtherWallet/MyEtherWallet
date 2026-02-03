import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { type WalletView } from '@/modules/access/common/walletConfigs'
import { type Chain } from '@/mew_api/types' /**
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
      setClickedWalletConnect(undefined)
    }
  })

  /**------------------------
   * Selected Chain
   -------------------------*/
  const selectedChain = ref<Chain | null>(null)

  const setSelectedChain = (chain: Chain | null) => {
    selectedChain.value = chain
  }

  const isEvmChain = computed(() => {
    return selectedChain.value?.type === 'EVM'
  })

  const isBitcoinChain = computed(() => {
    return selectedChain.value?.type === 'BITCOIN'
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
    selectedChain,
    isEvmChain,
    isBitcoinChain,
    setSelectedChain,
  }
})
