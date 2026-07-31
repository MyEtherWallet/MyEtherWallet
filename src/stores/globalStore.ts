import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { FeePriority } from '@/mew_api/types'
import { analytics } from '@/analytics'
import * as Sentry from '@sentry/vue'
import { safeLocalStorage } from '@/utils/safeStorage'
import { isTradingRestricted } from '@/modules/trade/providers/ondoHelpers'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { reportModuleError } from '@/utils/reportModuleError'
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
  const defaultGasPriceType = useStorage<FeePriority>('mew-default-gas-price-type', 'REGULAR', safeLocalStorage)

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
  // Fail closed until the session-level restriction check resolves.
  const isTradingRestrictedInRegion = ref(true)
  let tradingRestrictionPromise: Promise<boolean> | null = null

  const updateTradingRestriction = (restricted: boolean) => {
    isTradingRestrictedInRegion.value = restricted
    analytics.setIsRegionRestricted(restricted)
  }

  const fetchTradingRestriction = (): Promise<boolean> => {
    if (fetchedTradingThisSession.value) {
      return Promise.resolve(isTradingRestrictedInRegion.value)
    }
    if (tradingRestrictionPromise) return tradingRestrictionPromise

    const request = isTradingRestricted()
      .then(restricted => {
        updateTradingRestriction(restricted)
        fetchedTradingThisSession.value = true
        return restricted
      })
      .catch(error => {
        reportModuleError({
          tag: SENTRY_MODULE_TAGS.TRADE,
          title: 'TRADE: Error checking trading restriction',
          error,
        })
        updateTradingRestriction(true)
        // Keep failures retryable for consumers that mount later in the session.
        return true
      })

    tradingRestrictionPromise = request
    void request.then(() => {
      if (tradingRestrictionPromise === request) {
        tradingRestrictionPromise = null
      }
    })
    return request
  }

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
    fetchTradingRestriction,
    locale,
  }
})
