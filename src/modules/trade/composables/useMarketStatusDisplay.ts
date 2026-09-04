import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNow } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
import type { MarketStatusVariant } from '../components/TradeMarketStatusPill.vue'
import {
  buildLocalSessionRanges,
  computeTimelineMarkerPct,
  getEtNowInfo,
} from './marketDisplay'

const OPEN_SESSION_VARIANTS = ['premarket', 'postmarket', 'overnight'] as const

export function useMarketStatusDisplay() {
  const { marketStatus, isMarketOpen, isOffHoursOpen } = storeToRefs(
    useMarketStatusStore(),
  )
  const { t } = useI18n()
  const now = useNow({ interval: 30_000 })

  const pillStatus = computed<MarketStatusVariant>(() => {
    if (isOffHoursOpen.value) return 'weekend'
    if (isMarketOpen.value) {
      const session = marketStatus.value?.marketStatus
      const match = OPEN_SESSION_VARIANTS.find(variant => variant === session)
      return match ?? 'regular'
    }
    return 'paused'
  })

  const sessionLabel = (session: string | undefined): string => {
    const known = ['regular', 'premarket', 'postmarket', 'overnight', 'weekend']
    if (session && known.includes(session)) {
      return t(`trade.market_status.${session}`)
    }
    return session || ''
  }

  const formatTime = (isoDate: string): string =>
    new Date(isoDate).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })

  const formatWeekdayTime = (isoDate: string): string =>
    new Date(isoDate).toLocaleString(undefined, {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
    })

  const formatDurationUntil = (isoDate: string): string => {
    const diffMs = new Date(isoDate).getTime() - now.value.getTime()
    const diffMinutes = Math.ceil(diffMs / 60_000)
    if (diffMinutes < 60) {
      return t('trade.market_status.duration_minutes', {
        minutes: Math.max(diffMinutes, 1),
      })
    }
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return minutes > 0
      ? t('trade.market_status.duration_hours_minutes', { hours, minutes })
      : t('trade.market_status.duration_hours', { hours })
  }

  const untilText = computed(() => {
    const status = marketStatus.value
    if (!status) return ''

    if (pillStatus.value === 'weekend') {
      return status.offhours?.nextClose
        ? t('trade.market_status.until', {
            time: formatWeekdayTime(status.offhours.nextClose),
          })
        : ''
    }

    if (pillStatus.value === 'paused') {
      return status.nextOpen
        ? t('trade.market_status.until_session', {
            duration: formatDurationUntil(status.nextOpen),
            session: sessionLabel(status.nextOpenSession),
          })
        : ''
    }

    return status.nextClose
      ? t('trade.market_status.until', { time: formatTime(status.nextClose) })
      : ''
  })

  const nextOpenText = computed(() => {
    const status = marketStatus.value
    if (!status?.nextOpen) return ''
    return t('trade.market_status_popover.session_starts', {
      session: sessionLabel(status.nextOpenSession),
      time: formatWeekdayTime(status.nextOpen),
    })
  })

  const etNowInfo = computed(() => getEtNowInfo(now.value))

  const dayLabel = computed(() => etNowInfo.value.weekday.toUpperCase())

  const markerPct = computed(() =>
    computeTimelineMarkerPct(etNowInfo.value.minuteOfDay),
  )

  const timeLabel = computed(() =>
    now.value.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }),
  )

  const sessionRanges = computed(() => buildLocalSessionRanges(now.value))

  return {
    pillStatus,
    untilText,
    nextOpenText,
    dayLabel,
    markerPct,
    timeLabel,
    sessionRanges,
  }
}
