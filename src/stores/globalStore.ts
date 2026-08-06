import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { FeePriority } from '@/mew_api/types'
import { analytics } from '@/analytics'
import * as Sentry from '@sentry/vue'
import { safeLocalStorage } from '@/utils/safeStorage'
interface SelectedNetwork {
  selectedNetwork: string
}

export const useGlobalStore = defineStore('global', () => {
  /** --------------------
 * NETWORK
 --------------------*/
  const storage = useStorage<SelectedNetwork>(
    'selectedNetwork',
    {
      selectedNetwork: 'ETHEREUM', // default network
    },
    safeLocalStorage,
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
  const defaultGasPriceType = useStorage<FeePriority>(
    'mew-default-gas-price-type',
    'REGULAR',
    safeLocalStorage,
  )

  /**--------------------
   * LANGUAGE
   --------------------*/
  const locale = useStorage<string>('mew-locale', 'en', safeLocalStorage)

  /**--------------------
   * WELCOME DIALOG
   --------------------*/
  const welcomeDialogDismissed = useStorage<boolean>(
    'mew-welcome-dialog-dismissed',
    false,
    safeLocalStorage,
  )
  const dismissWelcomeDialog = () => {
    welcomeDialogDismissed.value = true
  }

  /**--------------------
   * TRADE
   --------------------*/
  const fetchedTradingThisSession = ref(false)
  const isTradingRestrictedInRegion = ref(false)
  const setIsTradingRestrictedInRegion = (restricted: boolean) => {
    isTradingRestrictedInRegion.value = restricted
    analytics.setIsRegionRestricted(restricted)
  }

  /**
   * Regional eligibility, resolved. True only once the geo check has come back
   * AND come back allowed.
   *
   * Anything that starts a trade must gate on this rather than on
   * `!isTradingRestrictedInRegion`: that flag starts `false`, so "not checked
   * yet" is indistinguishable from "allowed" and a gate written against it lets
   * orders through during the check. `fetchedTradingThisSession` only flips on a
   * successful fetch, so a failed check — which also sets restricted `true` —
   * stays blocked here too.
   *
   * Use `isTradingRestrictedInRegion` for the UI, where showing the restriction
   * notice before the check resolves would be the wrong default.
   */
  const isTradingAllowedInRegion = computed(
    () => fetchedTradingThisSession.value && !isTradingRestrictedInRegion.value,
  )

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
    isTradingAllowedInRegion,
    setIsTradingRestrictedInRegion,
    locale,
  }
})
