import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import {
  type WalletView,
  type WalletConfig,
} from '@/modules/access/common/walletConfigs'
import { type Chain } from '@/mew_api/types'
import { analytics } from '@/analytics'
import { ConnectWalletEvent } from '@/analytics/events'
/**
 * Store to manage the state of the access dialog.
 * It provides methods to open and close the dialog. Also manages
 * the current view within the dialog (default, wallet details, etc.)
 * and the selected chain for wallet connections.
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
    analytics.trackConnectWalletEvent(ConnectWalletEvent.SHOWN)
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

  /**------------------------
   * Clicked Web3 Wallet Config (for retry)
   -------------------------*/
  const clickedWeb3Wallet = ref<WalletConfig | undefined>(undefined)

  const setClickedWeb3Wallet = (config: WalletConfig | undefined) => {
    clickedWeb3Wallet.value = config
  }

  /**------------------------
   * Web3 Connection Error State
   -------------------------*/
  const web3ConnectionError = ref<string | null>(null)

  const setWeb3ConnectionError = (error: string | null) => {
    web3ConnectionError.value = error
  }
  const clearWeb3ConnectionError = () => {
    web3ConnectionError.value = null
  }

  watch(currentView, newView => {
    if (newView === 'default') {
      setClickedWalletConnect(undefined)
      setClickedWeb3Wallet(undefined)
      clearWeb3ConnectionError()
    }
  })

  /**------------------------
   * "Address already saved" step (extension connect)
   * Set when a connecting extension wallet's active address is already saved,
   * so the flow shows an informational modal instead of a silent no-op.
   -------------------------*/
  const addressSavedInfo = ref<{
    address: string
    addressName: string
    walletName: string
    walletIcon: string
    config: WalletConfig
  } | null>(null)
  const setAddressSavedInfo = (
    info: typeof addressSavedInfo.value,
  ): void => {
    addressSavedInfo.value = info
  }
  const clearAddressSavedInfo = (): void => {
    addressSavedInfo.value = null
  }

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
    clickedWeb3Wallet,
    setClickedWeb3Wallet,
    web3ConnectionError,
    setWeb3ConnectionError,
    clearWeb3ConnectionError,
    selectedChain,
    isEvmChain,
    isBitcoinChain,
    setSelectedChain,
    addressSavedInfo,
    setAddressSavedInfo,
    clearAddressSavedInfo,
  }
})
