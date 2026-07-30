import { ref } from 'vue'
import { isTradingRestricted } from '@/modules/trade/providers/ondoHelpers'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { reportModuleError } from '@/utils/reportModuleError'

const isTradingRestrictedInRegion = ref<boolean>(true)
let fetchPromise: Promise<boolean> | null = null

export function fetchTradingRestriction(): Promise<boolean> {
  if (!fetchPromise) {
    fetchPromise = isTradingRestricted()
      .then(result => {
        isTradingRestrictedInRegion.value = result
        return result
      })
      .catch(e => {
        reportModuleError({
          tag: SENTRY_MODULE_TAGS.TRADE,
          title: 'TRADE: Error checking trading restriction',
          error: e,
        })
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
