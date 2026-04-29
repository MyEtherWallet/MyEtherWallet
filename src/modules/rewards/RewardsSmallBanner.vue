<template>
  <div>
    <div
      class="bg-white rounded-2xl flex items-center gap-3 px-4 pl-20 py-6 cursor-pointer shadow-lg relative"
      @click="onLearnMore"
    >
      <img
        :src="usdcTokens"
        alt=""
        class="w-[70px] h-[70px] object-contain shrink-0 absolute left-[0px]"
        width="70"
        height="70"
      />
      <div class="flex-1 min-w-0">
        <p class="text-s-16 font-bold text-primary leading-tight">
          {{
            props.location === 'small-banner-swap' ? 'SWAP $50+' : 'TRADE $25+'
          }}
        </p>
        <p class="text-s-14 font-semibold text-blue-500">Earn 5 USDC.</p>
      </div>
      <button
        class="flex items-center gap-1 text-s-14 font-semibold text-primary whitespace-nowrap hoverOpacity shrink-0"
      >
        Learn more
        <span aria-hidden="true">→</span>
      </button>
    </div>
    <rewards-learn-more
      v-model:is-open="isLearnMoreOpen"
      :location="props.location"
      :swap-claimed="swapClaimed"
      :swap-no-rewards="swapNoRewards"
      :swap-remaining-pct="swapRemainingPct"
      :swap-remaining-count="swapRemainingCount"
      :swap-total="swapTotal"
      :trade-claimed="tradeClaimed"
      :trade-no-rewards="tradeNoRewards"
      :trade-remaining-pct="tradeRemainingPct"
      :trade-remaining-count="tradeRemainingCount"
      :trade-total="tradeTotal"
      :time-until-hour-reset="timeUntilHourReset"
      :time-until-next-eligible="timeUntilNextEligible"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import RewardsLearnMore from '@/modules/rewards/RewardsLearnMore.vue'
import { storeToRefs } from 'pinia'
import { useRewardsStore } from '@/stores/rewardsStore'
import usdcTokens from '@/assets/images/rewards/usdc-tokens-curved.png'

const props = defineProps<{
  location: 'small-banner-swap' | 'small-banner-trade' | 'small-banner-bridge'
}>()

const rewardsStore = useRewardsStore()
const {
  eligibility,
  swapClaimed,
  tradeClaimed,
  swapNoRewards,
  tradeNoRewards,
  swapTotal,
  swapRemainingPct,
  swapRemainingCount,
  tradeTotal,
  tradeRemainingPct,
  tradeRemainingCount,
  nextHourStart,
} = storeToRefs(rewardsStore)

const isLearnMoreOpen = ref(false)
const timeUntilHourReset = ref('--')
const timeUntilNextEligible = ref('--')
let countdownTimer: ReturnType<typeof setInterval> | null = null

function formatDiff(ms: number): string {
  const d = Math.floor(ms / 86_400_000)
  if (d > 0) return `${d} d`
  const h = Math.floor(ms / 3_600_000)
  if (h > 0) return `${h}h`
  const m = Math.floor(ms / 60_000)
  return `${m} min`
}

function updateCountdowns() {
  const hourTarget = nextHourStart.value
  timeUntilHourReset.value = hourTarget
    ? formatDiff(Math.max(0, new Date(hourTarget).getTime() - Date.now()))
    : '--'
  const eligibleTarget = eligibility.value?.nextEligibleDate
  timeUntilNextEligible.value = eligibleTarget
    ? formatDiff(Math.max(0, new Date(eligibleTarget).getTime() - Date.now()))
    : '--'
}

onMounted(() => {
  updateCountdowns()
  countdownTimer = setInterval(updateCountdowns, 60_000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const onLearnMore = () => {
  isLearnMoreOpen.value = true
}
</script>

<style scoped></style>
