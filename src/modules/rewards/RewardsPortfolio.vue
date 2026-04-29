<template>
  <!-- Claimed State -->
  <div
    v-if="!hadInitialLoad"
    class="bg-white rounded-16 h-full flex flex-col justify-center px-5 xs:px-[33px] lg-max:px-5 xl:px-[33px] 3xl:px-[33px] pt-8 pb-6 relative overflow-hidden max-h-[293px] animate-pulse"
  >
    <p class="text-center text-s-14 text-info">Loading Rewards</p>
  </div>
  <!-- Default State -->
  <div
    v-else
    class="bg-white rounded-16 h-full flex flex-col px-5 xs:px-[33px] pt-4 pb-4 relative overflow-hidden max-h-[293px]"
  >
    <!-- Top: Title + Image -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex flex-col">
        <h3 class="text-s-20 font-bold leading-tight">Earn rewards</h3>
        <p class="text-s-16 text-[#334155] leading-snug max-w-[200px] mt-1">
          First 10 trades of $25+ and swaps of $50+ earn 5 USDC each hour.
        </p>
        <button
          class="text-s-16 font-semibold underline text-left w-fit mt-1 hoverOpacity text-[#334155]"
          @click="onLearnMore"
        >
          Learn more
        </button>
      </div>
      <img
        :src="curvedUsdc"
        alt=""
        width="150"
        height="150"
        class="shrink-0 object-contain w-[80px] h-[80px] absolute right-[20px] top-[0px]"
      />
    </div>

    <!-- Reward Rows -->
    <rewards-rows
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
      @swap="goToSwap"
      @trade="goToTrade"
    />

    <rewards-learn-more
      v-model:is-open="isLearnMoreOpen"
      location="main-banner"
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
import RewardsRows from '@/modules/rewards/RewardsRows.vue'
import curvedUsdc from '@/assets/images/rewards/usdc-tokens-curved.png'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'
import { analytics, RewardsEvent } from '@/analytics'
import { useToastStore } from '@/stores/toastStore'
import { useRewardsStore } from '@/stores/rewardsStore'

const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
const { setWalletPanel } = walletMenuStore
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const rewardsStore = useRewardsStore()
const {
  hadInitialLoad,
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
  analytics.trackRewardsEvent(RewardsEvent.MAIN_BANNER_SHOWN)
  rewardsStore.fetchPool()
  updateCountdowns()
  countdownTimer = setInterval(updateCountdowns, 60_000)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})

const navigateTo = (panel: 'swap' | 'trade') => {
  const ETH_NETWORK_NAME = 'ETHEREUM'
  if (selectedNetwork.value !== ETH_NETWORK_NAME) {
    globalStore.setSelectedNetwork(ETH_NETWORK_NAME)
    toastStore.addToastMessage({ text: 'Switched app network to Ethereum' })
  }
  setWalletPanel(panel)
  if (!isOpenSideMenu.value) {
    walletMenuStore.setIsOpenSideMenu(true)
  }
}

const goToSwap = () => {
  analytics.trackRewardsEvent(RewardsEvent.CLICK_SWAP, {
    location: 'main-banner',
  })
  navigateTo('swap')
}

const goToTrade = () => {
  navigateTo('trade')
}

const onLearnMore = () => {
  isLearnMoreOpen.value = true
}
</script>

<style scoped>
.rewards-bg {
  background: linear-gradient(135deg, rgba(141, 66, 255, 0.4) 0%, #c7d8ff 100%);
}

.confetti-piece {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.confetti-piece:nth-child(3n) {
  background: #7b61ff;
  width: 6px;
  height: 12px;
  border-radius: 1px;
  transform: rotate(45deg);
}

.confetti-piece:nth-child(3n + 1) {
  background: #3b82f6;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.confetti-piece:nth-child(3n + 2) {
  background: #fbbf24;
  width: 5px;
  height: 14px;
  border-radius: 1px;
  transform: rotate(-30deg);
}
</style>
