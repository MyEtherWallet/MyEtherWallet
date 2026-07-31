import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import {
  getMarketStatus,
  TRADING_RESTRICTED_HELP_URL,
} from '../providers/ondoHelpers'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { useGlobalStore } from '@/stores/globalStore'
import { resolveCurrentSession } from '../common/marketSession'
import { reportModuleError } from '@/utils/reportModuleError'

interface UseMarketStatusOptions {
  onMarketOpen?: () => void | Promise<void>
}


export function useMarketStatus(options: UseMarketStatusOptions = {}) {
  const { onMarketOpen } = options
  const globalStore = useGlobalStore()
  const { fetchTradingRestriction } = globalStore
  const { t } = useI18n()

  const marketStatus = ref<GetWebSwapOndoMarketStatusResponse | null>(null)
  const countdownText = ref<string>('')
  let countdownInterval: ReturnType<typeof setInterval> | null = null
  let wasMarketClosed = false

  const isMarketOpen = computed(() => marketStatus.value?.isOpen ?? true)

  // Off-hours (24/7) track — true on weekends/holidays when off-hours is enabled.
  const isOffHoursOpen = computed(
    () => marketStatus.value?.offhours?.isOpen ?? false,
  )

  // The session key to test an asset's tradableSessions against (null = nothing tradable).
  const currentSession = computed(() => resolveCurrentSession(marketStatus.value))

  // True when ANY session is tradable (conventional or off-hours). Drives the
  // global blur/closed overlay — only fully closed when this is false. While
  // market status is still loading (null) we stay optimistic to avoid a blur
  // flash on open (mirrors the previous `isOpen ?? true` behavior).
  const isTradingSessionOpen = computed(
    () => marketStatus.value === null || currentSession.value !== null,
  )

  const updateCountdown = () => {
    // Only count down in the fully-closed state (Case 3); any open session
    // (conventional or off-hours) clears it.
    if (!marketStatus.value?.nextOpen || isTradingSessionOpen.value) {
      countdownText.value = ''
      return
    }

    const now = Date.now()
    const nextOpen = new Date(marketStatus.value.nextOpen).getTime()
    const diff = nextOpen - now

    if (diff <= 0) {
      countdownText.value = t('trade.opening_soon')
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

  const fetchMarketStatus = async () => {
    try {
      const [statusResult] = await Promise.all([
        getMarketStatus(),
        fetchTradingRestriction(),
      ])
      marketStatus.value = statusResult

      // Drive closure side-effects off the real tradable state (Case 3), so
      // off-hours-open is treated as open and onMarketOpen only fires on a true
      // closed -> open transition.
      if (!isTradingSessionOpen.value) {
        wasMarketClosed = true
        startCountdown()
      } else {
        stopCountdown()
        // Trading just (re)opened - call the callback if it was previously closed
        if (wasMarketClosed && onMarketOpen) {
          wasMarketClosed = false
          await onMarketOpen()
        }
      }
    } catch (e) {
      reportModuleError({
        tag: SENTRY_MODULE_TAGS.TRADE,
        title: 'TRADE: Error fetching market status',
        error: e,
      })
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
    isOffHoursOpen,
    currentSession,
    isTradingSessionOpen,
    tradingRestrictedHelpUrl: TRADING_RESTRICTED_HELP_URL,
    countdownText,
    fetchMarketStatus,
    formatNextOpen,
  }
}
