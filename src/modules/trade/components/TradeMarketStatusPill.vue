<template>
  <div
    ref="pillRef"
    class="relative w-full flex items-center justify-between bg-white border-1 border-border-default rounded-full px-3 py-2"
  >
    <!-- The whole pill toggles the popover. The popover holds a link and a close
         button, so it can't live inside a <button>: this one covers the pill
         underneath the (click-through) labels instead. -->
    <button
      type="button"
      :aria-label="$t('trade.market_status.info_label')"
      :aria-expanded="infoOpen"
      class="absolute inset-0 rounded-full hoverNoBG"
      @click="infoOpen = !infoOpen"
    />
    <div class="relative flex items-center gap-1 pointer-events-none">
      <p
        :class="[
          'text-s-12 font-semibold leading-[18px] tracking-[-0.24px]',
          statusColorClass,
        ]"
      >
        {{ $t(`trade.market_status.${status}`) }}
      </p>
      <template v-if="isLimited">
        <p class="text-s-12 text-text-subtle leading-[18px]">•</p>
        <p class="text-s-12 text-text-subtle leading-[18px]">
          {{ $t('trade.market_status.limited') }}
        </p>
      </template>
      <!-- The popover is anchored to this wrapper so its arrow stays under the
           info icon regardless of how wide the translated status label is. -->
      <span class="relative flex">
        <span class="flex items-center justify-center w-5 h-5">
          <AppIcon name="information-circle" size="xxs" />
        </span>
        <trade-market-status-popover
          v-if="infoOpen"
          :status="status"
          :next-open-text="nextOpenText"
          :day-label="dayLabel"
          :marker-pct="markerPct"
          :time-label="timeLabel"
          :session-ranges="sessionRanges"
          :boundary="pillRef"
          class="pointer-events-auto"
          @close="infoOpen = false"
        />
      </span>
    </div>
    <p class="relative text-s-12 text-text-subtle leading-[18px] pointer-events-none">
      {{ untilText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import TradeMarketStatusPopover from './TradeMarketStatusPopover.vue'
import type { TimelineSessionRanges } from './TradeMarketTimeline.vue'

import AppIcon from '@/components/icon/AppIcon.vue'
export type MarketStatusVariant =
  'regular' | 'premarket' | 'postmarket' | 'overnight' | 'weekend' | 'paused'

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

// The pill holds both the toggle and the popover, so clicks on either don't
// count as outside.
const pillRef = ref<HTMLElement | null>(null)

// The popover otherwise only closes via its own X button and stays up while
// the user interacts with the rest of the panel.
onClickOutside(pillRef, () => {
  if (infoOpen.value) infoOpen.value = false
})
onKeyStroke('Escape', () => {
  if (infoOpen.value) infoOpen.value = false
})

const isLimited = computed(() =>
  ['premarket', 'postmarket', 'overnight', 'weekend'].includes(props.status),
)

const statusColorClass = computed(() => {
  if (props.status === 'paused') return 'text-text-subtle'
  return isLimited.value ? 'text-text-warning' : 'text-text-success'
})
</script>
