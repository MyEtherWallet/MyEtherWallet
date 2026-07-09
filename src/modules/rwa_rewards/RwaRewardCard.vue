<template>
  <div
    class="relative isolate bg-white overflow-hidden flex flex-col justify-between items-start h-[220px] p-5 rounded-16"
  >
    <img
      :src="illustrationSrc"
      alt=""
      class="pointer-events-none select-none absolute bottom-0 right-0 object-cover object-bottom h-full w-[205px]"
    />

    <div class="relative z-10 flex flex-col max-w-[250px] gap-2">
      <div class="flex flex-col">
        <p
          class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
        >
          {{ title }}
        </p>
        <p class="text-s-14 font-normal leading-5 text-[#575757]">
          {{ description }}
        </p>
      </div>
      <p
        v-if="footnote"
        class="text-s-12 font-normal leading-[18px] text-[#575757]"
      >
        {{ footnote }}
      </p>
    </div>

    <div class="relative z-10 flex flex-col items-start justify-center gap-3">
      <div
        v-if="statusText"
        class="py-1 px-2 rounded-8 text-s-11 font-bold leading-[15px] tracking-sp-06 uppercase whitespace-nowrap"
        :style="{ color: statusBadge.text, background: statusBadge.bg }"
      >
        {{ statusText }}
      </div>
      <div
        v-if="primaryLabel || secondaryLabel"
        class="flex items-center gap-2"
      >
        <button
          v-if="primaryLabel"
          class="flex items-center h-10 pr-3 pl-4 gap-1 rounded-full text-s-14 font-semibold"
          :class="
            primaryDisabled
              ? 'bg-[#f5f5f5] text-[#767676] cursor-default'
              : 'bg-primary text-white cursor-pointer hoverOpacityHasBG'
          "
          :disabled="primaryDisabled"
          @click="primaryDisabled || emit('primary')"
        >
          {{ primaryLabel }}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 5l5 5-5 5"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          v-if="secondaryLabel"
          class="hoverOpacityHasBG h-10 px-4 rounded-full bg-[#e6e6e6] text-black text-s-14 font-semibold"
          @click="emit('secondary')"
        >
          {{ secondaryLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import illusTrade from '@/assets/images/rwa-rewards/hero-claimed.webp'
import illusHold from '@/assets/images/rwa-rewards/hero-holding.webp'
import illusFees from '@/assets/images/rwa-rewards/hero-earned.webp'
import illusTradeGrey from '@/assets/images/rwa-rewards/hero-claimed-grey.webp'
import illusHoldGrey from '@/assets/images/rwa-rewards/hero-holding-grey.webp'

export type RwaCardIllustration = 'trade' | 'hold' | 'fees'
export type RwaRewardStatus =
  | 'ongoing'
  | 'holding'
  | 'noRewards'
  | 'claimed'
  | 'paused'
  | 'ended'
  | 'banned'
  | 'notEligible'

const props = defineProps<{
  illustration: RwaCardIllustration
  title: string
  description: string
  footnote?: string
  status?: RwaRewardStatus
  statusText?: string
  primaryLabel?: string
  primaryDisabled?: boolean
  secondaryLabel?: string
}>()

const emit = defineEmits<{ primary: []; secondary: [] }>()

const illustrationSrc = computed(() => {
  const normal = { trade: illusTrade, hold: illusHold, fees: illusFees }
  const grey = { trade: illusTradeGrey, hold: illusHoldGrey, fees: illusFees }
  const isGrey =
    props.status === 'ended' ||
    props.status === 'banned' ||
    props.status === 'notEligible'
  return (isGrey ? grey : normal)[props.illustration]
})

const statusBadge = computed(
  () =>
    ({
      ongoing: { text: '#005ae5', bg: '#d6edff' },
      holding: { text: '#005ae5', bg: '#d6edff' },
      noRewards: { text: '#bb5602', bg: '#ffedc5' },
      claimed: { text: '#067f71', bg: '#c8fff1' },
      paused: { text: '#bb5602', bg: '#ffedc5' },
      ended: { text: '#cc0452', bg: '#ffdbe3' },
      banned: { text: '#cc0452', bg: '#ffdbe3' },
      notEligible: { text: '#cc0452', bg: '#ffdbe3' },
    })[props.status ?? 'ongoing'],
)
</script>
