import { ref, computed, onScopeDispose } from 'vue'

/**
 * Live countdown to a target instant. Ticks once per second and clamps at 0.
 * `remainingMs` is null while there is no (or an invalid) target, so callers
 * can distinguish "nothing to count" from "expired".
 */
export function useCountdown(
  target: () => string | number | Date | null | undefined,
) {
  const now = ref(Date.now())
  const timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
  onScopeDispose(() => clearInterval(timer))

  const remainingMs = computed<number | null>(() => {
    const targetValue = target()
    if (targetValue === null || targetValue === undefined) return null
    const timestamp = new Date(targetValue).getTime()
    if (Number.isNaN(timestamp)) return null
    return Math.max(0, timestamp - now.value)
  })

  return { remainingMs }
}
