import { computed, watch, type Ref } from 'vue'
import { useDocumentVisibility, useTimestamp } from '@vueuse/core'

// While a quote stays expired (e.g. a silent refresh failed), a new refresh
// attempt is triggered at this interval so transient errors self-recover.
const RETRY_INTERVAL_MS = 10_000

interface UseQuoteCountdownOptions {
  /** Absolute timestamp (ms) at which the current quote expires, null when there is no quote. */
  expiresAt: Ref<number | null>
  /** Absolute timestamp (ms) until which quote requests are rate-limited, null when not limited. */
  rateLimitedUntil: Ref<number | null>
  /** Countdown only triggers refreshes while enabled. */
  enabled: Ref<boolean>
  /** Called to request a fresh quote once the current one expires. */
  onExpire: () => void
}

/**
 * Tracks the lifetime of a purchase quote against an absolute expiration
 * timestamp and triggers a refresh when it expires. Refreshes are skipped
 * while the tab is hidden (they resume immediately once it becomes visible
 * again) and while a rate-limit cooldown is active.
 */
export function useQuoteCountdown(options: UseQuoteCountdownOptions) {
  const { expiresAt, rateLimitedUntil, enabled, onExpire } = options

  const now = useTimestamp({ interval: 1000 })
  const visibility = useDocumentVisibility()

  const secondsLeft = computed(() => {
    if (expiresAt.value === null) return null
    return Math.max(0, Math.ceil((expiresAt.value - now.value) / 1000))
  })

  const isExpired = computed(
    () => expiresAt.value !== null && now.value >= expiresAt.value,
  )

  const cooldownSecondsLeft = computed(() => {
    if (rateLimitedUntil.value === null) return null
    const left = Math.ceil((rateLimitedUntil.value - now.value) / 1000)
    return left > 0 ? left : null
  })

  const countdownText = computed(() => {
    if (secondsLeft.value === null) return ''
    const minutes = Math.floor(secondsLeft.value / 60)
    const seconds = secondsLeft.value % 60
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  })

  // Increments every RETRY_INTERVAL_MS while the quote is expired, so the
  // watcher below re-fires even when no other source changes value.
  const retryTick = computed(() => {
    if (expiresAt.value === null || now.value < expiresAt.value) return 0
    return Math.floor((now.value - expiresAt.value) / RETRY_INTERVAL_MS)
  })

  watch([isExpired, enabled, visibility, cooldownSecondsLeft, retryTick], () => {
    if (!enabled.value || visibility.value !== 'visible') return
    if (!isExpired.value || cooldownSecondsLeft.value !== null) return
    onExpire()
  })

  return { secondsLeft, isExpired, cooldownSecondsLeft, countdownText }
}
