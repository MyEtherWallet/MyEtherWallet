import { ref, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import {
  getMarketStatus,
  isTradingRestricted,
  TRADING_RESTRICTED_HELP_URL,
} from '../providers/ondoHelpers'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import Configs from '@/configs'
import { useGlobalStore } from '@/stores/globalStore'

const isDevMode = Configs.IS_DEV_MODE

interface UseMarketStatusOptions {
  onMarketOpen?: () => void | Promise<void>
}


export function useMarketStatus(options: UseMarketStatusOptions = {}) {
  const { onMarketOpen } = options
  const { fetchedTradingThisSession, isTradingRestrictedInRegion } = storeToRefs(useGlobalStore())
  const marketStatus = ref<GetWebSwapOndoMarketStatusResponse | null>(null)
  const countdownText = ref<string>('')
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  let wasMarketClosed = false

  const isMarketOpen = computed(() => marketStatus.value?.isOpen ?? true)

  const updateCountdown = () => {
    if (!marketStatus.value?.nextOpen || isMarketOpen.value) {
      countdownText.value = ''
      return
    }

    const now = Date.now()
    const nextOpen = new Date(marketStatus.value.nextOpen).getTime()
    const diff = nextOpen - now

    if (diff <= 0) {
      countdownText.value = 'Opening soon...'
      // Refresh market status when countdown reaches zero
      fetchMarketStatus()
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (hours > 0) {
      countdownText.value = `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      countdownText.value = `${minutes}m ${seconds}s`
    } else {
      countdownText.value = `${seconds}s`
    }
  }

  const startCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)
  }

  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }

  const fetchTradingRestriction = async () => {
    // should only fetch this once in the session
    if (fetchedTradingThisSession.value) {
      return fetchedTradingThisSession.value;
    }
    try {
      const res = await isTradingRestricted()
      isTradingRestrictedInRegion.value = res
      fetchedTradingThisSession.value = true;
    } catch (e) {
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
      isTradingRestrictedInRegion.value = false
    }
  }

  const fetchMarketStatus = async () => {
    try {
      const [statusResult] = await Promise.all([
        getMarketStatus(),
        fetchTradingRestriction(),
      ])
      marketStatus.value = statusResult

      if (!marketStatus.value.isOpen) {
        wasMarketClosed = true
        startCountdown()
      } else {
        stopCountdown()
        // Market just opened - call the callback if market was previously closed
        if (wasMarketClosed && onMarketOpen) {
          wasMarketClosed = false
          await onMarketOpen()
        }
      }
    } catch (e) {
      if (isDevMode) {
        console.error('Failed to fetch market status:', e)
      } else {
        captureException(e, {
          ...SENTRY_MODULE_TAGS.TRADE,
          extra: {
            title: 'TRADE: Error fetching market status',
            errorMessage: (e as Error).message || 'Unknown error',
          },
        })
      }
    }
  }

  const formatNextOpen = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    } catch {
      return dateString
    }
  }

  onUnmounted(() => {
    stopCountdown()
  })

  return {
    marketStatus,
    isMarketOpen,
    isTradingRestrictedInRegion,
    tradingRestrictedHelpUrl: TRADING_RESTRICTED_HELP_URL,
    countdownText,
    fetchMarketStatus,
    formatNextOpen,
  }
}
