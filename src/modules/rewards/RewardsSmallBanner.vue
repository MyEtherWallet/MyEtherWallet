<template>
  <div v-if="!isBanned">
    <div
      class="bg-mewBg rounded-2xl flex items-center gap-3 px-3 py-3 cursor-pointer shadow-sm relative mb-3"
      @click="onLearnMore"
    >
      <div class="flex-1 min-w-0">
        <p class="text-s-11 font-semibold text-black leading-tight">
          {{
            props.location === 'small-banner-swap' ? 'Swap $50+' : 'Trade $35+'
          }}
          on Ethereum and
          <span class="text-primary"> Earn 5 USDC</span>
        </p>
      </div>
      <button
        class="flex items-center gap-1 text-s-14 text-black underline whitespace-nowrap hoverOpacity shrink-0"
      >
        Learn more
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
      :trade-market-closed="tradeMarketClosed"
      :trade-remaining-pct="tradeRemainingPct"
      :trade-remaining-count="tradeRemainingCount"
      :trade-total="tradeTotal"
      :time-until-hour-reset="timeUntilRewardHourReset"
      :time-until-swap-next-eligible="timeUntilSwapNextEligible"
      :time-until-trade-next-eligible="timeUntilTradeNextEligible"
      :time-until-market-open="timeUntilMarketOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import RewardsLearnMore from '@/modules/rewards/RewardsLearnMore.vue'
import { storeToRefs } from 'pinia'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useMarketStatus } from '@/modules/trade/composables/useMarketStatus'

const props = defineProps<{
  location: 'small-banner-swap' | 'small-banner-trade' | 'small-banner-bridge'
}>()

const rewardsStore = useRewardsStore()
const {
  eligibilityV2,
  swapClaimed,
  tradeClaimed,
  swapNoRewards,
  tradeNoRewards,
  tradeMarketClosed,
  swapTotal,
  swapRemainingPct,
  swapRemainingCount,
  tradeTotal,
  tradeRemainingPct,
  tradeRemainingCount,
  nextHourStart,
  isBanned,
} = storeToRefs(rewardsStore)

const isLearnMoreOpen = ref(false)
const timeUntilRewardHourReset = ref('--')
const timeUntilSwapNextEligible = ref('--')
const timeUntilTradeNextEligible = ref('--')
let countdownTimer: ReturnType<typeof setInterval> | null = null

const { countdownText: timeUntilMarketOpen, fetchMarketStatus } =
  useMarketStatus()

function formatDiff(ms: number): string {
  const d = Math.floor(ms / 86_400_000)
  if (d > 0) return `${d} d`
  const h = Math.floor(ms / 3_600_000)
  if (h > 0) return `${h}h`
  const m = Math.floor(ms / 60_000)
  return `${m} min`
}

const updateCountdowns = () => {
  const hourTarget = nextHourStart.value
  timeUntilRewardHourReset.value = hourTarget
    ? formatDiff(Math.max(0, new Date(hourTarget).getTime() - Date.now()))
    : '--'

  timeUntilSwapNextEligible.value = eligibilityV2.value?.swap.nextEligibleDate
    ? formatDiff(
        Math.max(
          0,
          new Date(eligibilityV2.value?.swap.nextEligibleDate).getTime() -
            Date.now(),
        ),
      )
    : '--'
  timeUntilTradeNextEligible.value = eligibilityV2.value?.trade.nextEligibleDate
    ? formatDiff(
        Math.max(
          0,
          new Date(eligibilityV2.value?.trade.nextEligibleDate).getTime() -
            Date.now(),
        ),
      )
    : '--'
}

onMounted(() => {
  fetchMarketStatus()
  updateCountdowns()
  countdownTimer = setInterval(updateCountdowns, 1000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const onLearnMore = () => {
  isLearnMoreOpen.value = true
}
</script>

<style scoped></style>
