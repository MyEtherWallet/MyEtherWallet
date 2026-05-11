import { ref } from 'vue'
import { captureException } from '@sentry/vue'
import { isTradingRestricted } from '@/modules/trade/providers/ondoHelpers'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import Configs from '@/configs'

const isDevMode = Configs.IS_DEV_MODE

const isTradingRestrictedInRegion = ref<boolean>(false)
let fetchPromise: Promise<boolean> | null = null

export function fetchTradingRestriction(): Promise<boolean> {
  if (!fetchPromise) {
    fetchPromise = isTradingRestricted()
      .then(result => {
        isTradingRestrictedInRegion.value = result
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
