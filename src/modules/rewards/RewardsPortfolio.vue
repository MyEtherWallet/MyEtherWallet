<template>
  <!-- Claimed State -->
  <div>
    <div
      v-if="!hadInitialLoad"
      class="bg-white rounded-16 h-full flex flex-col justify-center px-5 xs:px-[33px] lg-max:px-5 xl:px-[33px] 3xl:px-[33px] pt-8 pb-6 relative overflow-hidden max-h-[293px] animate-pulse"
    >
      <p class="text-center text-s-14 text-info">Loading Rewards</p>
    </div>
    <!-- Default State -->
    <div
      v-else
      class="bg-white rounded-16 h-full flex flex-col justify-space-around px-5 pb-5 relative overflow-hidden xl:max-h-[293px]"
    >
      <!-- Top: Title + Image -->
      <div class="flex items-start justify-between gap-2 mb-5">
        <div class="flex flex-col pt-5">
          <h3 class="text-s-20 font-bold leading-none">Earn rewards</h3>
          <p class="text-s-16 text-[#575757] leading-[22px] mt-2 max-w-[295px]">
            The first 15 trades over $25 every hour receive $5 in USDC in
            rewards. Once per week per wallet.
          </p>
          <button
            class="text-s-16 underline text-left w-fit mt-1 hoverOpacity"
            @click="onLearnMore"
          >
            Learn more
          </button>
        </div>
        <img
          :src="verticalUsdc"
          alt=""
          width="92"
          height="130"
          class="shrink-0 object-contain w-[92px] h-[130px] flex-none -mt-2 hidden 3xl:w-[92px] 3xl:h-[130px]"
          :class="
            isOpenSideMenu
              ? 'xl:hidden 2xl:block 2xl:w-[60px] 2xl:h-[90px]'
              : 'xl:block xl:w-[80px] xl:h-[120px] 2xl:w-[92px] 2xl:h-[130px]'
          "
        />
      </div>

      <!-- Reward Rows -->
      <rewards-rows
        v-if="!isBanned"
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
        :has-swap="false"
        :has-trade="true"
        @swap="goToSwap"
        @trade="goToTrade"
        class="max-w-[360px] 2xl:max-w-none"
        :class="[isOpenSideMenu ? '2xl:-ml-2 2xl:-mr-2' : 'mt-5']"
        is-rewards-view
      />

      <!-- Not Eligible State -->
      <div v-else class="border-t border-grey-10 pt-4 pb-1">
        <p class="text-s-14 font-semibold text-error leading-5">
          Not eligible for rewards
        </p>
        <!-- <p
          class="text-s-14 text-[#575757] leading-5 mt-1"
          :class="{ '2xl:hidden ': isOpenSideMenu }"
        >
          Wallets created after April 20th are not eligible for rewards. Try
          connecting an older wallet.
        </p> -->
        <button
          class="mt-4 bg-grey-5 text-black font-medium text-s-16 rounded-full py-2 px-5 hoverOpacity"
          @click="onConnectAddress"
        >
          Connect another address
        </button>
      </div>
      <img
        :src="horizontalUsdc"
        alt=""
        width="650"
        height="292"
        class="shrink-0 object-contain hidden xs:block 3xl:hidden flex-none absolute top-0 right-[20px] mx-auto pointer-events-none max-h-[140px] max-w-[140px] 2xl:hidden"
        :class="[isOpenSideMenu ? '' : 'xl:hidden']"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import RewardsLearnMore from '@/modules/rewards/RewardsLearnMore.vue'
import RewardsRows from '@/modules/rewards/RewardsRows.vue'
import verticalUsdc from '@/assets/images/rewards/usdc-rewards-group-vertical.png'
import horizontalUsdc from '@/assets/images/rewards/usdc-rewards-group-horizontal.png'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { storeToRefs } from 'pinia'
import { analytics, RewardsEvent } from '@/analytics'
import { useToastStore } from '@/stores/toastStore'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useAccessStore } from '@/stores/accessStore'
import { useMarketStatus } from '@/modules/trade/composables/useMarketStatus'

const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
const { setWalletPanel } = walletMenuStore
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const rewardsStore = useRewardsStore()
const {
  hadInitialLoad,
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

function updateCountdowns() {
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
  analytics.trackRewardsEvent(RewardsEvent.MAIN_BANNER_SHOWN)
  rewardsStore.fetchPool()
  fetchMarketStatus()
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
  analytics.trackRewardsEvent(RewardsEvent.CLICK_TRADE, {
    location: 'main-banner',
  })
  navigateTo('trade')
}

const onLearnMore = () => {
  isLearnMoreOpen.value = true
}

const accessStore = useAccessStore()
const onConnectAddress = () => {
  accessStore.openAccessDialog()
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
