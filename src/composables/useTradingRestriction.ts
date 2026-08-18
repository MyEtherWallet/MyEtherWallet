import { ref } from 'vue'
import { captureException } from '@sentry/vue'
import { isTradingRestricted } from '@/modules/trade/providers/ondoHelpers'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { useGlobalStore } from '@/stores/globalStore'
import Configs from '@/configs'

const isDevMode = Configs.IS_DEV_MODE

const isTradingRestrictedInRegion = ref<boolean>(true)
let fetchPromise: Promise<boolean> | null = null

/**
 * Mirror the resolved geo verdict into the global store, which is what pushes
 * the `isRegionRestricted` Amplitude user property. Kept in a try/catch because
 * this runs from a router guard: reporting must never be able to break
 * navigation, and the store is only reachable once pinia is installed.
 */
const reportRestriction = (restricted: boolean): void => {
  try {
    useGlobalStore().setIsTradingRestrictedInRegion(restricted)
  } catch (e) {
    if (isDevMode) {
      console.error('Failed to report trading restriction:', e)
    }
  }
}

export function fetchTradingRestriction(): Promise<boolean> {
  if (!fetchPromise) {
    fetchPromise = isTradingRestricted()
      .then(result => {
        isTradingRestrictedInRegion.value = result
        reportRestriction(result)
        return result
      })
      .catch(e => {
        if (isDevMode) {
          console.error('Failed to check trading restriction:', e)
        } else {
          captureException(e, {
            ...SENTRY_MODULE_TAGS.TRADE,
            extra: {
              title: 'TRADE: Error checking trading restriction',
              errorMessage: (e as Error).message || 'Unknown error',
            },
          })
        }
        isTradingRestrictedInRegion.value = true
        // Fail closed, and report it as such — a geo check that could not be
        // resolved is treated as restricted everywhere else too.
        reportRestriction(true)
        fetchPromise = null
        return true
      })
  }
  return fetchPromise
}

export function useTradingRestriction() {
  fetchTradingRestriction()
  return { isTradingRestrictedInRegion }
}
