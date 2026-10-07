<template>
  <!-- Claimed State -->
  <div>
    <div
      v-if="!hadInitialLoad"
      class="bg-white rounded-16 h-full flex flex-col justify-center px-5 xs:px-[33px] lg-max:px-5 xl:px-[33px] 3xl:px-[33px] pt-8 pb-6 relative overflow-hidden max-h-[293px] animate-pulse"
    >
      <p class="text-center text-s-14 text-text-subtle">
        {{ t('rewards.loading') }}
      </p>
    </div>
    <!-- Default State -->
    <div
      v-else
      class="bg-white rounded-16 h-full flex flex-col justify-space-around px-5 pb-5 relative overflow-hidden xl:max-h-[293px]"
    >
      <!-- Top: Title + Image -->
      <div class="flex items-start justify-between gap-2 mb-5">
        <div class="flex flex-col pt-5">
          <h3 class="text-s-20 font-bold leading-none">
            {{ t('rewards.earn_rewards_title') }}
          </h3>
          <p
            class="text-s-16 text-text-subtle leading-[22px] mt-2 max-w-[295px]"
          >
            {{
              t('rewards.portfolio_trade_description', { min: minSpendTrade })
            }}
          </p>
          <button
            class="text-s-16 underline text-left w-fit mt-1 hoverOpacity"
            @click="onLearnMore"
          >
            {{ t('rewards.learn_more') }}
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
              : 'xl:block xl:w-20 xl:h-[120px] 2xl:w-[92px] 2xl:h-[130px]'
          "
        />
      </div>

      <!-- Reward Rows -->
      <rewards-rows
        v-if="!isBanned"
        :trade-claimed="tradeClaimed"
        :trade-no-rewards="tradeNoRewards"
        :trade-paused="isRewardsPaused"
        :trade-remaining-pct="tradeRemainingPct"
        :trade-remaining-count="tradeRemainingCount"
        :trade-total="tradeTotal"
        :min-spend-trade="minSpendTrade"
        @trade="goToTrade"
        class="max-w-[360px] 2xl:max-w-none"
        :class="[isOpenSideMenu ? '2xl:-ml-2 2xl:-mr-2' : 'mt-5']"
        is-rewards-view
      />

      <!-- Not Eligible State -->
      <div v-else class="border-t border-border-default pt-4 pb-1">
        <p class="text-s-14 font-semibold text-text-error leading-5">
          {{ t('rewards.not_eligible_for_rewards') }}
        </p>
        <button
          class="mt-4 bg-background-default text-black font-medium text-s-16 rounded-full py-2 px-5 hoverOpacity"
          @click="onConnectAddress"
        >
          {{ t('rewards.connect_another_address') }}
        </button>
      </div>
      <img
        :src="horizontalUsdc"
        alt=""
        width="650"
        height="292"
        class="shrink-0 object-contain hidden xs:block 3xl:hidden flex-none absolute top-0 right-5 mx-auto pointer-events-none max-h-[140px] max-w-[140px] 2xl:hidden"
        :class="[isOpenSideMenu ? '' : 'xl:hidden']"
      />

      <rewards-learn-more
        v-model:is-open="isLearnMoreOpen"
        location="main-banner"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
const { setWalletPanel } = walletMenuStore
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const rewardsStore = useRewardsStore()
const {
  hadInitialLoad,
  tradeClaimed,
  tradeNoRewards,
  isRewardsPaused,
  tradeTotal,
  tradeRemainingPct,
  tradeRemainingCount,
  isBanned,
  minSpendTrade,
} = storeToRefs(rewardsStore)

const isLearnMoreOpen = ref(false)

onMounted(() => {
  analytics.trackRewardsEvent(RewardsEvent.MAIN_BANNER_SHOWN)
  rewardsStore.fetchPool()
})

const navigateTo = (panel: 'swap' | 'trade') => {
  const ETH_NETWORK_NAME = 'ETHEREUM'
  if (selectedNetwork.value !== ETH_NETWORK_NAME) {
    globalStore.setSelectedNetwork(ETH_NETWORK_NAME)
    toastStore.addToastMessage({ text: t('rewards.switched_to_ethereum') })
  }
  setWalletPanel(panel)
  if (!isOpenSideMenu.value) {
    walletMenuStore.setIsOpenSideMenu(true)
  }
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
  width: var(--size-2);
  height: var(--size-2);
  border-radius: 2px;
}

.confetti-piece:nth-child(3n) {
  background: #7b61ff;
  width: var(--size-1-5);
  height: var(--size-3);
  border-radius: 1px;
  transform: rotate(45deg);
}

.confetti-piece:nth-child(3n + 1) {
  background: #3b82f6;
  width: var(--size-2);
  height: var(--size-2);
  border-radius: 50%;
}

.confetti-piece:nth-child(3n + 2) {
  background: #fbbf24;
  width: 5px; /* off-scale: decorative confetti, no size token */
  height: var(--size-3-5);
  border-radius: 1px;
  transform: rotate(-30deg);
}
</style>
