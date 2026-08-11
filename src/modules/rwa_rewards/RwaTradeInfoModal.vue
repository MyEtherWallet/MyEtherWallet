<template>
  <rewards-learn-more
    v-model:is-open="isOpenModel"
    location="main-banner"
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import RewardsLearnMore from '@/modules/rewards/RewardsLearnMore.vue'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useRwaAnnouncementStore } from '@/stores/rwaAnnouncementStore'
import { useMarketStatus } from '@/modules/trade/composables/useMarketStatus'

const isOpenModel = defineModel<boolean>('isOpen', { default: false })

// Published so the weekend-trading tooltip can hold off while this is up.
// Reported here rather than at the call site so every caller is covered.
const { setTradeInfoOpen } = useRwaAnnouncementStore()
watch(isOpenModel, open => setTradeInfoOpen(open), { immediate: true })

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
} = storeToRefs(rewardsStore)

const timeUntilRewardHourReset = ref('--')
const timeUntilSwapNextEligible = ref('--')
const timeUntilTradeNextEligible = ref('--')
let countdownTimer: ReturnType<typeof setInterval> | null = null

const { countdownText: timeUntilMarketOpen, fetchMarketStatus } =
  useMarketStatus()

const formatDiff = (ms: number): string => {
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
          new Date(eligibilityV2.value.swap.nextEligibleDate).getTime() -
            Date.now(),
        ),
      )
    : '--'
  timeUntilTradeNextEligible.value = eligibilityV2.value?.trade.nextEligibleDate
    ? formatDiff(
        Math.max(
          0,
          new Date(eligibilityV2.value.trade.nextEligibleDate).getTime() -
            Date.now(),
        ),
      )
    : '--'
}

onMounted(() => {
  rewardsStore.fetchPool()
  fetchMarketStatus()
  updateCountdowns()
  countdownTimer = setInterval(updateCountdowns, 60_000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  // Navigating away with the modal open counts as closing it — otherwise the
  // flag stays set and holds the tooltip off for the rest of the session.
  if (isOpenModel.value) setTradeInfoOpen(false)
})
</script>
