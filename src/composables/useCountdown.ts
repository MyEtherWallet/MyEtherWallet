import { ref, computed, onScopeDispose } from 'vue'

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
