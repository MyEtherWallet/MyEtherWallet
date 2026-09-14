import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { type CreateWalletView } from '@/modules/access/common/walletConfigs'
import { analytics } from '@/analytics'
import { CreateWalletEvent } from '@/analytics/events'
/**
 * Store to manage the state of the access dialog.
 * It provides methods to open and close the dialog.
 */

interface WC_Wallet {
  walletName: string
  walletIcon: string
  wagmiWalletData?: string
}
export const useCreateStore = defineStore('createStore', () => {
  const isOpenCreateDialog = ref(false)
  const openCreateDialog = () => {
    isOpenCreateDialog.value = true
    analytics.trackCreateWalletEvent(CreateWalletEvent.SHOWN)
  }
  /** See accessStore.ensureAccessDialogOpen — same contract for the create dialog. */
  const ensureCreateDialogOpen = () => {
    if (isOpenCreateDialog.value) return
    openCreateDialog()
  }

  const closeCreateDialog = () => {
    isOpenCreateDialog.value = false
    currentView.value = 'default'
  }

  const currentView = ref<CreateWalletView>('default')
  const setCurrentView = (view: CreateWalletView) => {
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

  return {
    isOpenCreateDialog,
    openCreateDialog,
    ensureCreateDialogOpen,
    closeCreateDialog,
    currentView,
    setCurrentView,
    clickedWalletConnect,
    setClickedWalletConnect,
    setWagmiWalletData,
  }
})
