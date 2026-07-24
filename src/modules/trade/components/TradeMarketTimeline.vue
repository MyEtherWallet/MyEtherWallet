<template>
  <div class="w-full flex items-start gap-2">
    <p class="text-s-12 font-semibold leading-[18px] tracking-[-0.24px]">
      {{ dayLabel }}
    </p>
    <div class="flex-1 min-w-0 flex flex-col">
      <div class="relative flex items-center gap-1 h-3">
        <div
          v-for="(segment, index) in segments"
          :key="index"
          :class="[
            'relative flex items-center h-3 cursor-pointer',
            segment.isCap ? 'w-[22px] shrink-0' : 'flex-1 min-w-px',
          ]"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <div
            v-if="hoveredIndex === index"
            class="absolute -inset-x-0.5 top-0 h-3 rounded-full bg-grey-10"
          />
          <div
            :class="[
              'relative h-1.5 w-full',
              segment.colorClass,
              segment.roundClass,
            ]"
          />
          <div
            v-if="hoveredIndex === index"
            class="absolute bottom-[14px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center drop-shadow-[0px_0px_0.5px_rgba(0,0,0,0.25),0px_1.5px_2px_rgba(0,0,0,0.12)]"
          >
            <div class="bg-white rounded-16 p-4 whitespace-nowrap">
              <p
                :class="[
                  'text-s-12 font-semibold leading-[18px] tracking-[-0.24px]',
                  segment.titleColorClass,
                ]"
              >
                {{ segment.title }}
              </p>
              <p class="text-s-12 leading-[18px]">{{ segment.range }}</p>
            </div>
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              class="shrink-0 rotate-180"
            >
              <path d="M6 0L12 10H0Z" fill="white" />
            </svg>
          </div>
        </div>
        <div
          class="absolute top-0 h-3 w-[3px] -translate-x-1/2 bg-black border border-white"
          :style="{ left: `${markerPct}%` }"
        />
      </div>
      <div class="relative w-full h-[18px]">
        <p
          class="absolute top-0 -translate-x-1/2 text-s-12 text-grey-subtle leading-[18px] whitespace-nowrap"
          :style="{ left: `clamp(30px, ${markerPct}%, calc(100% - 30px))` }"
        >
          {{ timeLabel }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type SessionKey = 'premarket' | 'regular' | 'postmarket' | 'overnight'

const props = withDefaults(
  defineProps<{
    dayLabel: string
    markerPct: number
    timeLabel: string
    sessionRanges?: Record<SessionKey, string>
  }>(),
  {
    sessionRanges: () => ({
      premarket: '04:00 AM → 09:31 AM',
      regular: '09:31 AM → 03:59 PM',
      postmarket: '04:01 PM → 07:59 PM',
      overnight: '08:05 PM → 03:55 AM',
    }),
  },
)

const { t } = useI18n()

const hoveredIndex = ref<number | null>(null)

const ORANGE = 'bg-orange-600'
const GREEN = 'bg-success-600'
const ORANGE_TEXT = 'text-orange-600'
const GREEN_TEXT = 'text-success-600'

const segments = computed(() => {
  const session = (key: SessionKey) => ({
    title: t(`trade.market_timeline.${key}`),
    range: props.sessionRanges[key],
    titleColorClass: key === 'regular' ? GREEN_TEXT : ORANGE_TEXT,
  })
  return [
    {
      ...session('overnight'),
      isCap: true,
      colorClass: ORANGE,
      roundClass: 'rounded-r-full',
    },
    {
      ...session('premarket'),
      isCap: false,
      colorClass: ORANGE,
      roundClass: 'rounded-full',
    },
    {
      ...session('regular'),
      isCap: false,
      colorClass: GREEN,
      roundClass: 'rounded-full',
    },
    {
      ...session('postmarket'),
      isCap: false,
      colorClass: ORANGE,
      roundClass: 'rounded-full',
    },
    {
      ...session('overnight'),
      isCap: true,
      colorClass: ORANGE,
      roundClass: 'rounded-l-full',
    },
  ]
})
</script>