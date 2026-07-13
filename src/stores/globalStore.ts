import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { FeePriority } from '@/mew_api/types'
import { analytics } from '@/analytics'
import * as Sentry from '@sentry/vue'
interface SelectedNetwork {
  selectedNetwork: string
}

export const useGlobalStore = defineStore('global', () => {
  /** --------------------
 * NETWORK
 --------------------*/
  const storage = useLocalStorage<SelectedNetwork>(
    'selectedNetwork',
    {
      selectedNetwork: 'ETHEREUM', // default network
    },
    { mergeDefaults: true },
  )

  const selectedNetwork = computed(() => {
    return storage.value.selectedNetwork
  })
  const isEIP1559SupportedNetwork = ref(true) // change to computed in the future
  const setSelectedNetwork = (network: string) => {
    if (network === '') return
    storage.value.selectedNetwork = network
    analytics.setNetwork(network)
    Sentry.setTag('network', network)
  }
  /**--------------------
   * GAS
   --------------------*/
  const eip1559 = ref({
    baseFeePerGas: '0',
    maxFeePerGas: '0',
  })
  const gasPriceType = ref<FeePriority>('REGULAR')
  const defaultGasPriceType = useLocalStorage<FeePriority>('mew-default-gas-price-type', 'REGULAR')

  /**--------------------
   * WELCOME DIALOG
   --------------------*/
  const welcomeDialogDismissed = useLocalStorage<boolean>(
    'mew-welcome-dialog-dismissed',
    false,
  )
  const dismissWelcomeDialog = () => {
    welcomeDialogDismissed.value = true
  }

  /**--------------------
   * TRADE
   --------------------*/
  const fetchedTradingThisSession = ref(false)
  const isTradingRestrictedInRegion = ref(false)

  return {
    isEIP1559SupportedNetwork,
    eip1559,
    gasPriceType,
    defaultGasPriceType,
    selectedNetwork,
    setSelectedNetwork,
    welcomeDialogDismissed,
    dismissWelcomeDialog,
    fetchedTradingThisSession,
    isTradingRestrictedInRegion,
  }
})
