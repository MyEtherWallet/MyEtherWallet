import { ref } from 'vue'
import { isTradingRestricted } from '@/modules/trade/providers/ondoHelpers'

const isTradingRestrictedInRegion = ref<boolean>(false)
let fetchPromise: Promise<boolean> | null = null

export function fetchTradingRestriction(): Promise<boolean> {
  if (!fetchPromise) {
    fetchPromise = isTradingRestricted()
      .then(result => {
        isTradingRestrictedInRegion.value = result
        return result
      })
      .catch(() => {
        isTradingRestrictedInRegion.value = false
        return false
      })
  }
  return fetchPromise
}

export function useTradingRestriction() {
  fetchTradingRestriction()
  return { isTradingRestrictedInRegion }
}
