<template>
  <div
    class="absolute top-full mt-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.25),0px_1.5px_2px_rgba(0,0,0,0.12)]"
  >
    <svg width="12" height="10" viewBox="0 0 12 10" class="shrink-0">
      <path d="M6 0L12 10H0Z" fill="white" />
    </svg>
    <div
      class="relative w-[260px] flex flex-col items-start gap-5 rounded-16 bg-white p-4"
    >
      <div class="w-full">
        <p class="text-s-12 font-semibold leading-[18px] tracking-[-0.24px]">
          {{ title }}
        </p>
        <p class="text-s-12 text-info leading-[18px]">{{ body }}</p>
        <p class="text-s-12 text-info leading-[18px]">
          <a
            :href="marketHoursHelpUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-black underline"
            >{{ $t('trade.market_status_popover.learn_more') }}</a
          >
          {{ $t('trade.market_status_popover.learn_more_suffix') }}
        </p>
      </div>
      <div class="w-full border-t border-grey-10" />
      <p v-if="status === 'weekend'" class="text-s-12 text-info leading-[18px]">
        {{ nextOpenText }}
      </p>
      <trade-market-timeline
        v-else
        :day-label="timelineDayLabel"
        :marker-pct="timelineMarkerPct"
        :time-label="timelineTimeLabel"
        :session-ranges="timelineRanges"
      />
      <button
        :aria-label="$t('common.close')"
        class="absolute right-1 top-1 flex w-6 h-6 items-center justify-center rounded-full hoverNoBG"
        @click="emit('close')"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import TradeMarketTimeline, {
  type TimelineSessionRanges,
} from './TradeMarketTimeline.vue'
import {
  buildLocalSessionRanges,
  computeTimelineMarkerPct,
  getEtNowInfo,
} from '../common/marketDisplay'
import type { MarketStatusVariant } from './TradeMarketStatusPill.vue'

const props = withDefaults(
  defineProps<{
    status: MarketStatusVariant
    nextOpenText?: string
    dayLabel?: string
    markerPct?: number
    timeLabel?: string
    sessionRanges?: TimelineSessionRanges
  }>(),
  {
    nextOpenText: '',
    dayLabel: undefined,
    markerPct: undefined,
    timeLabel: undefined,
    sessionRanges: undefined,
  },
)

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const marketHoursHelpUrl = 'https://help.myetherwallet.com/'

// Live fallbacks for callers that omit the timeline props — placeholder data
// ("MON", 55%, "01:15 PM") must never render as if it were real.
const mountedAt = new Date()
const timelineDayLabel = computed(
  () => props.dayLabel ?? getEtNowInfo(mountedAt).weekday.toUpperCase(),
)
const timelineMarkerPct = computed(
  () =>
    props.markerPct ??
    computeTimelineMarkerPct(getEtNowInfo(mountedAt).minuteOfDay),
)
const timelineTimeLabel = computed(
  () =>
    props.timeLabel ??
    mountedAt.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }),
)
const timelineRanges = computed(
  () => props.sessionRanges ?? buildLocalSessionRanges(mountedAt),
)

const title = computed(() => {
  const titles: Record<MarketStatusVariant, string> = {
    regular: t('trade.market_status_popover.open_title'),
    premarket: t('trade.market_status_popover.premarket_title'),
    postmarket: t('trade.market_status_popover.closed_title'),
    overnight: t('trade.market_status_popover.closed_title'),
    weekend: t('trade.market_status_popover.weekend_title'),
    paused: t('trade.market_status_popover.paused_title'),
  }
  return titles[props.status]
})

const body = computed(() => {
  if (props.status === 'regular')
    return t('trade.market_status_popover.open_body')
  if (props.status === 'paused')
    return props.nextOpenText || t('trade.market_status_popover.paused_body')
  return t('trade.market_status_popover.limited_body')
})
</script>
