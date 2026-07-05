<template>
  <div
    class="relative isolate bg-white overflow-hidden flex flex-col justify-between items-start"
    style="height: 220px; padding: 20px; border-radius: 16px"
  >
    <img
      :src="illustrationSrc"
      alt=""
      class="pointer-events-none select-none absolute bottom-0 right-0 object-cover object-bottom"
      style="height: 100%; width: 205px"
    />

    <div class="relative z-10 flex flex-col" style="max-width: 250px; gap: 8px">
      <div class="flex flex-col">
        <p
          style="
            font-size: 16px;
            font-weight: 600;
            line-height: 22px;
            letter-spacing: -0.32px;
            color: #000;
          "
        >
          {{ title }}
        </p>
        <p
          style="
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #575757;
          "
        >
          {{ description }}
        </p>
      </div>
      <p
        v-if="footnote"
        style="
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          color: #575757;
        "
      >
        {{ footnote }}
      </p>
    </div>

    <div
      class="relative z-10 flex flex-col items-start"
      style="gap: 12px; justify-content: center"
    >
      <div
        v-if="statusText"
        style="
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          line-height: 15px;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          white-space: nowrap;
        "
        :style="{ color: statusBadge.text, background: statusBadge.bg }"
      >
        {{ statusText }}
      </div>
      <div
        v-if="primaryLabel || secondaryLabel"
        class="flex items-center"
        style="gap: 8px"
      >
        <button
          v-if="primaryLabel"
          class="flex items-center"
          :class="{ hoverOpacityHasBG: !primaryDisabled }"
          style="
            height: 40px;
            padding: 0 12px 0 16px;
            gap: 4px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
          "
          :style="{
            background: primaryDisabled ? '#f5f5f5' : '#005ae5',
            color: primaryDisabled ? '#767676' : '#fff',
            cursor: primaryDisabled ? 'default' : 'pointer',
          }"
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
          class="hoverOpacityHasBG"
          style="
            height: 40px;
            padding: 0 16px;
            border-radius: 9999px;
            background: #e6e6e6;
            color: #000;
            font-size: 14px;
            font-weight: 600;
          "
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