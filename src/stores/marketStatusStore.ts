import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { captureException } from '@sentry/vue'
import type { GetWebSwapOndoMarketStatusResponse } from '@/mew_api/types'
import { getMarketStatus } from '@/modules/trade/providers/ondoHelpers'
import { resolveCurrentSession } from '@/modules/trade/common/marketSession'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import Configs from '@/configs'
import i18n from '@/i18n'
import { useGlobalStore } from './globalStore'

const isDevMode = Configs.IS_DEV_MODE

const REFRESH_BUFFER_MS = 2_000
const MIN_REFRESH_DELAY_MS = 10_000
const STALE_AFTER_MS = 60_000
const MAX_FAILURE_BACKOFF_MS = 300_000

export const useMarketStatusStore = defineStore('marketStatus', () => {
  const globalStore = useGlobalStore()
  const { fetchTradingRestriction } = globalStore

  const marketStatus = ref<GetWebSwapOndoMarketStatusResponse | null>(null)
  const countdownText = ref('')
  const lastFetchedAt = ref(0)

  let countdownInterval: ReturnType<typeof setInterval> | null = null
  let refreshTimeout: ReturnType<typeof setTimeout> | null = null
  let inFlightFetch: Promise<void> | null = null
  let consecutiveFailures = 0
  let staleBoundaryRefreshes = 0
  let visibilityListenerAttached = false

  /**
   * Polling, the 1s countdown tick and the visibilitychange listener run only
   * while at least one consumer is mounted (`acquire`/`release`, same pattern
   * as perpsStatusStore). A bare `fetchMarketStatus()` with no consumers is a
   * one-shot: it updates state and schedules nothing.
   */
  let consumers = 0

  const isMarketOpen = computed(() => marketStatus.value?.isOpen ?? true)

  const isOffHoursOpen = computed(
    () => marketStatus.value?.offhours?.isOpen ?? false,
  )

  const currentSession = computed(() =>
    resolveCurrentSession(marketStatus.value),
  )

  const isTradingSessionOpen = computed(
    () => marketStatus.value === null || currentSession.value !== null,
  )

  const activeBoundary = (): string | null | undefined => {
    const status = marketStatus.value
    if (!status) return null
    if (status.offhours?.isOpen) return status.offhours.nextClose
    if (status.isOpen) return status.nextClose
    return status.nextOpen
  }

  const hasStaleBoundary = (): boolean => {
    const boundary = activeBoundary()
    if (!boundary) return false
    const time = new Date(boundary).getTime()
    return Number.isFinite(time) && time <= Date.now()
  }

  const updateCountdown = () => {
    if (!marketStatus.value?.nextOpen || isTradingSessionOpen.value) {
      countdownText.value = ''
      return
    }

    const now = Date.now()
    const nextOpen = new Date(marketStatus.value.nextOpen).getTime()
    const diff = nextOpen - now

    if (diff <= 0) {
      countdownText.value = i18n.global.t('trade.opening_soon')
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
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
    countdownText.value = ''
  }

  const nextTransitionAt = (): number | null => {
    const status = marketStatus.value
    if (!status) return null
    const now = Date.now()
    const futureTimestamps = [
      status.nextClose,
      status.nextOpen,
      status.offhours?.nextOpen,
      status.offhours?.nextClose,
    ]
      .map(value => (value ? new Date(value).getTime() : NaN))
      .filter(time => Number.isFinite(time) && time > now)
    return futureTimestamps.length ? Math.min(...futureTimestamps) : null
  }

  const scheduleNextRefresh = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
      refreshTimeout = null
    }
    if (consumers === 0) return
    if (consecutiveFailures > 0) {
      const backoff = Math.min(
        MIN_REFRESH_DELAY_MS * 2 ** (consecutiveFailures - 1),
        MAX_FAILURE_BACKOFF_MS,
      )
      refreshTimeout = setTimeout(() => {
        fetchMarketStatus()
      }, backoff)
      return
    }
    const transitionAt = nextTransitionAt()
    let delay: number
    if (hasStaleBoundary() || !transitionAt) {
      // The backend keeps answering with boundaries already in the past. Back
      // off like a failure instead of hammering it every 10s indefinitely.
      staleBoundaryRefreshes += 1
      delay = Math.min(
        MIN_REFRESH_DELAY_MS * 2 ** (staleBoundaryRefreshes - 1),
        MAX_FAILURE_BACKOFF_MS,
      )
    } else {
      staleBoundaryRefreshes = 0
      delay = Math.max(
        transitionAt + REFRESH_BUFFER_MS - Date.now(),
        MIN_REFRESH_DELAY_MS,
      )
    }
    refreshTimeout = setTimeout(() => {
      fetchMarketStatus()
    }, delay)
  }

  const onVisibilityChange = () => {
    if (
      document.visibilityState === 'visible' &&
      Date.now() - lastFetchedAt.value > STALE_AFTER_MS
    ) {
      fetchMarketStatus()
    }
  }

  const attachVisibilityListener = () => {
    if (visibilityListenerAttached) return
    document.addEventListener('visibilitychange', onVisibilityChange)
    visibilityListenerAttached = true
  }

  const detachVisibilityListener = () => {
    if (!visibilityListenerAttached) return
    document.removeEventListener('visibilitychange', onVisibilityChange)
    visibilityListenerAttached = false
  }

  /**
   * Register a live consumer. The first one fetches fresh data (which also
   * starts the refresh loop and, while the market is closed, the countdown
   * tick) and attaches the visibility listener; later ones share them.
   */
  const acquire = () => {
    consumers += 1
    if (consumers > 1) return
    attachVisibilityListener()
    void fetchMarketStatus()
  }

  /** Drop a consumer; the last one out stops every timer and listener. */
  const release = () => {
    consumers = Math.max(0, consumers - 1)
    if (consumers > 0) return
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
      refreshTimeout = null
    }
    stopCountdown()
    detachVisibilityListener()
  }

  const fetchMarketStatus = async (): Promise<void> => {
    if (inFlightFetch) return inFlightFetch
    inFlightFetch = (async () => {
      try {
        const [statusResult] = await Promise.all([
          getMarketStatus(),
          fetchTradingRestriction(),
        ])
        if (statusResult) {
          marketStatus.value = statusResult
        }
        consecutiveFailures = 0
        lastFetchedAt.value = Date.now()

        if (!isTradingSessionOpen.value && consumers > 0) {
          startCountdown()
        } else {
          stopCountdown()
        }
      } catch (e) {
        consecutiveFailures += 1
        if (isDevMode) {
          console.error('Failed to fetch market status:', e)
        } else if (consecutiveFailures === 1) {
          captureException(e, {
            ...SENTRY_MODULE_TAGS.TRADE,
            extra: {
              title: 'TRADE: Error fetching market status',
              errorMessage: (e as Error).message || 'Unknown error',
            },
          })
        }
      } finally {
        inFlightFetch = null
        scheduleNextRefresh()
      }
    })()
    return inFlightFetch
  }

  return {
    marketStatus,
    countdownText,
    lastFetchedAt,
    isMarketOpen,
    isOffHoursOpen,
    currentSession,
    isTradingSessionOpen,
    hasStaleBoundary,
    fetchMarketStatus,
    acquire,
    release,
  }
})
