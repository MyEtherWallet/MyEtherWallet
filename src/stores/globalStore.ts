import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useStorage, useColorMode } from '@vueuse/core'
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
   * THEME
   *
   * Writes `data-theme="light|dark"` onto <html>, which is what the semantic
   * colour tokens in main.css key off.
   *
   * Defaults to `light` and deliberately does NOT follow the OS. The dark
   * palette exists and is complete at the token layer, but the app is not:
   * chart colours and a few hundred hardcoded literals still render light-only
   * (see modules/rwa_rewards and modules/perps). Following prefers-color-scheme
   * here would ship that half-finished state to every dark-OS user with no way
   * to opt out, now that there is no toggle in Settings.
   *
   * To review the dark palette use /dev/colors, which scopes `data-theme` to a
   * container. To turn dark mode on for real later, set initialValue back to
   * `auto` (or restore a toggle) and update the matching pre-paint script in
   * index.html so the two agree.
   --------------------*/
  const theme = useColorMode({
    selector: 'html',
    attribute: 'data-theme',
    storageKey: 'mew-theme',
    // Private-browsing modes throw on localStorage access; safeLocalStorage
    // degrades to an in-memory shim instead of taking the app down with it.
    storage: safeLocalStorage,
    initialValue: 'light',
    // Plenty of components carry `transition-colors`; without this the whole
    // page smears through the change instead of switching cleanly.
    disableTransition: true,
  })
  const isDarkTheme = computed(() => theme.value === 'dark')

  /**
   * Keep the browser chrome tint on `background/base`. CSS can't reach a meta
   * tag, and a `media` query on it would only ever track the OS — so an
   * explicit in-app override needs this watcher to be reflected.
   */
  watch(
    isDarkTheme,
    dark => {
      if (typeof document === 'undefined') return
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', dark ? '#1a1a1a' : '#f5f5f5')
    },
    { immediate: true },
  )

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
   * BALANCE VISIBILITY
   * Global, persisted amount-hide toggle (the "eye" on portfolio surfaces).
   --------------------*/
  const hideBalances = useStorage<boolean>(
    'mew-hide-balances',
    false,
    safeLocalStorage,
  )
  const toggleHideBalances = () => {
    hideBalances.value = !hideBalances.value
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

  /**
   * Regional eligibility, resolved. True only once the geo check has come back
   * AND come back allowed.
   *
   * Anything that starts a trade must gate on this rather than on
   * `!isTradingRestrictedInRegion`. Both start out blocked, but only this one
   * stays blocked after a *failed* check: `fetchTradingRestriction` leaves
   * `fetchedTradingThisSession` false on failure so the check can be retried,
   * and a retry that also fails must not read as "allowed" in between.
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
    hideBalances,
    toggleHideBalances,
    fetchedTradingThisSession,
    isTradingRestrictedInRegion,
    fetchTradingRestriction,
    isTradingAllowedInRegion,
    locale,
    theme,
    isDarkTheme,
  }
})
