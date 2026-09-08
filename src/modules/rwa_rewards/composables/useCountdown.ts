import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Live countdown to a target date. Shows a single, largest applicable unit
 * (weeks → days → hours → minutes → seconds), never combined.
 */
export function useCountdown(
  target: () => string | number | Date | null | undefined,
) {
  const { t } = useI18n()
  const now = ref(Date.now())
  const timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
  onUnmounted(() => clearInterval(timer))

  const remainingMs = computed<number | null>(() => {
    const tgt = target()
    // Nullish rather than falsy: epoch 0 is a valid timestamp, and `new Date(0)`
    // is a real date. Date instances are read directly rather than re-wrapped.
    if (tgt == null) return null
    const ts = tgt instanceof Date ? tgt.getTime() : new Date(tgt).getTime()
    if (Number.isNaN(ts)) return null
    return Math.max(0, ts - now.value)
  })

  const text = computed(() => {
    const ms = remainingMs.value
    if (ms === null) return ''
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const unit = (n: number, key: string) =>
      `${n} ${t(`rwaRewards.${key}`, n)}`
    if (weeks >= 1) return unit(weeks, 'unit_week')
    if (days >= 1) return unit(days, 'unit_day')
    if (hours >= 1) return unit(hours, 'unit_hour')
    if (minutes >= 1) return unit(minutes, 'unit_minute')
    return unit(seconds, 'unit_second')
  })

  return { text, remainingMs }
}