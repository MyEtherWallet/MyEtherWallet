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
  let visibilityListenerAttached = false

  const isMarketOpen = computed(() => marketStatus.value?.isOpen ?? true)

  const isOffHoursOpen = computed(
    () => marketStatus.value?.offhours?.isOpen ?? false,
  )

  const currentSession = computed(() =>
    resolveCurrentSession(marketStatus.value),
  )

  // True when ANY session is tradable (conventional or off-hours). While the
  // status is still loading (null) we stay optimistic to avoid a blur flash.
  const isTradingSessionOpen = computed(
    () => marketStatus.value === null || currentSession.value !== null,
  )

  // The boundary that ends whatever state the status claims we are in.
  const activeBoundary = (): string | null | undefined => {
    const status = marketStatus.value
    if (!status) return null
    if (status.offhours?.isOpen) return status.offhours.nextClose
    if (status.isOpen) return status.nextClose
    return status.nextOpen
  }

  // The upstream status is served from a snapshot that can trail real time by a
  // couple of minutes, so right after a session boundary it still reports the
  // session we just left, with the boundary that ended it already in the past.
  // Callers must not read a state this describes as settled: between sessions
  // the market is closed while this still says it is open, and quotes fail.
  // A function rather than a computed: it depends on the clock, not on state
  // Vue can track, so a cached value would keep answering for a boundary that
  // has since passed.
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

  // Earliest upcoming session boundary reported by the API (conventional or
  // off-hours). Null when every reported timestamp is already in the past.
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

  // One timer aimed at the next boundary (+buffer so the backend is already
  // past it). If the API still reports stale boundaries, retry on a short
  // delay until it crosses over.
  const scheduleNextRefresh = () => {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
      refreshTimeout = null
    }
    // During an API outage, back off exponentially (up to 5 min) instead of
    // hammering the endpoint every 10 seconds from every open tab.
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
    // A passed boundary means the snapshot has not caught up yet. Retrying on
    // the short delay is what makes "until it crosses over" true: aiming at
    // `nextTransitionAt` instead would skip to the *following* session's
    // boundary, leaving the stale state on screen for the whole gap between
    // sessions — reported as every pair being unavailable.
    const delay =
      hasStaleBoundary() || !transitionAt
        ? MIN_REFRESH_DELAY_MS
        : Math.max(
            transitionAt + REFRESH_BUFFER_MS - Date.now(),
            MIN_REFRESH_DELAY_MS,
          )
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

        if (!isTradingSessionOpen.value) {
          startCountdown()
        } else {
          stopCountdown()
        }
      } catch (e) {
        consecutiveFailures += 1
        if (isDevMode) {
          console.error('Failed to fetch market status:', e)
        } else if (consecutiveFailures === 1) {
          // Only the first failure of a streak is reported — an outage would
          // otherwise produce one event per retry, per open tab.
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
        attachVisibilityListener()
        scheduleNextRefresh()
      }
    })()
    return inFlightFetch
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
    fetchTradingRestriction,
    formatNextOpen,
  }
})
