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
    // Reset any leftover state from a previous session so the chooser always
    // opens clean — otherwise a stale connecting/view state can show through.
    currentView.value = 'default'
    clickedWeb3Wallet.value = undefined
    clickedWalletConnect.value = undefined
    web3ConnectionError.value = null
    isOpenAccessDialog.value = true
    analytics.trackConnectWalletEvent(ConnectWalletEvent.SHOWN)
  }

  /**
   * Ensure the dialog is open, without disturbing it if it already is. Used by the
   * access ROUTE view on mount: most callers open the dialog by flag and the URL then
   * follows (see ModuleAccessWallet), so by the time the route view mounts the dialog
   * is already up — re-running openAccessDialog there would reset the caller's
   * `currentView` and fire a second SHOWN event. Only a genuine route-first entry
   * (deep link, header CTA) actually opens it here.
   */
  const ensureAccessDialogOpen = () => {
    if (isOpenAccessDialog.value) return
    openAccessDialog()
  }
  const closeAccessDialog = () => {
    isOpenAccessDialog.value = false
    currentView.value = 'default'
    clickedWeb3Wallet.value = undefined
    clickedWalletConnect.value = undefined
    web3ConnectionError.value = null
    expectNewAddress.value = false
    intendedAddress.value = null
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
  const setAddressSavedInfo = (info: typeof addressSavedInfo.value): void => {
    addressSavedInfo.value = info
  }
  const clearAddressSavedInfo = (): void => {
    addressSavedInfo.value = null
  }
  // True only while adding a *new* address ("Connect another"): a duplicate then
  // means "already saved". Connecting a specific saved address (upgrade
  // watch-only → signing) leaves this false so it connects instead of warning.
  const expectNewAddress = ref(false)
  const setExpectNewAddress = (v: boolean): void => {
    expectNewAddress.value = v
  }

  // The specific address the user is trying to connect ("Connect address"). An
  // extension only connects its active account, so if it differs we must prompt
  // the user to select this address in the extension.
  const intendedAddress = ref<string | null>(null)
  const setIntendedAddress = (addr: string | null): void => {
    intendedAddress.value = addr
  }
  const connectAddressInfo = ref<{
    address: string
    walletName: string
    walletIcon: string
    config: WalletConfig
  } | null>(null)
  const setConnectAddressInfo = (
    info: typeof connectAddressInfo.value,
  ): void => {
    connectAddressInfo.value = info
  }
  const clearConnectAddressInfo = (): void => {
    connectAddressInfo.value = null
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
    ensureAccessDialogOpen,
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
    expectNewAddress,
    setExpectNewAddress,
    intendedAddress,
    setIntendedAddress,
    connectAddressInfo,
    setConnectAddressInfo,
    clearConnectAddressInfo,
  }
})
