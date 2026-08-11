<template>
  <div
    class="w-full flex items-center justify-between bg-white border-1 border-grey-10 rounded-full px-3 py-2"
  >
    <div class="relative flex items-center gap-1">
      <p
        :class="[
          'text-s-12 font-semibold leading-[18px] tracking-[-0.24px]',
          statusColorClass,
        ]"
      >
        {{ $t(`trade.market_status.${status}`) }}
      </p>
      <template v-if="isLimited">
        <p class="text-s-12 text-info leading-[18px]">•</p>
        <p class="text-s-12 text-info leading-[18px]">
          {{ $t('trade.market_status.limited') }}
        </p>
      </template>
      <button
        :aria-label="$t('trade.market_status.info_label')"
        class="flex items-center justify-center w-5 h-5 rounded-[10px] hoverNoBG"
        @click="infoOpen = !infoOpen"
      >
        <InformationCircleIcon class="w-4 h-4" />
      </button>
      <trade-market-status-popover
        v-if="infoOpen"
        :status="status"
        :next-open-text="nextOpenText"
        :day-label="dayLabel"
        :marker-pct="markerPct"
        :time-label="timeLabel"
        :session-ranges="sessionRanges"
        @close="infoOpen = false"
      />
    </div>
    <p class="text-s-12 text-info leading-[18px]">{{ untilText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import TradeMarketStatusPopover from './TradeMarketStatusPopover.vue'
import type { TimelineSessionRanges } from './TradeMarketTimeline.vue'

export type MarketStatusVariant =
  | 'regular'
  | 'premarket'
  | 'postmarket'
  | 'overnight'
  | 'weekend'
  | 'paused'

const props = defineProps<{
  status: MarketStatusVariant
  untilText: string
  nextOpenText?: string
  dayLabel?: string
  markerPct?: number
  timeLabel?: string
  sessionRanges?: TimelineSessionRanges
}>()

const infoOpen = defineModel<boolean>('infoOpen', { default: false })

const isLimited = computed(() =>
  ['premarket', 'postmarket', 'overnight', 'weekend'].includes(props.status),
)

const statusColorClass = computed(() => {
  if (props.status === 'paused') return 'text-info'
  return isLimited.value ? 'text-orange-600' : 'text-success-600'
})
</script>
