import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
import { useGlobalStore } from '@/stores/globalStore'
import { TRADING_RESTRICTED_HELP_URL } from '../providers/ondoHelpers'

interface UseMarketStatusOptions {
  onMarketOpen?: () => void | Promise<void>
}

export function useMarketStatus(options: UseMarketStatusOptions = {}) {
  const { onMarketOpen } = options
  const marketStatusStore = useMarketStatusStore()
  const {
    marketStatus,
    countdownText,
    isMarketOpen,
    isOffHoursOpen,
    currentSession,
    isTradingSessionOpen,
  } = storeToRefs(marketStatusStore)

  if (onMarketOpen) {
    watch(isTradingSessionOpen, async (isOpen, wasOpen) => {
      if (isOpen && !wasOpen) {
        await onMarketOpen()
      }
    })
  }

  return {
    marketStatus,
    isMarketOpen,
    isOffHoursOpen,
    currentSession,
    isTradingSessionOpen,
    hasStaleMarketStatus: marketStatusStore.hasStaleBoundary,
    tradingRestrictedHelpUrl: TRADING_RESTRICTED_HELP_URL,
    countdownText,
    fetchMarketStatus: marketStatusStore.fetchMarketStatus,
    fetchTradingRestriction: useGlobalStore().fetchTradingRestriction,
    formatNextOpen: marketStatusStore.formatNextOpen,
  }
}
