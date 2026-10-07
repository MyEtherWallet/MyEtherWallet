<template>
  <app-dialog v-model:is-open="isOpenModel" class="sm:max-w-[440px] sm:mx-auto">
    <template #content>
      <div class="px-6 py-6 flex flex-col">
        <!-- Title -->
        <!-- <h3 class="text-s-28 font-bold leading-p-120 text-text-brand">Trade</h3> -->
        <h3 class="text-s-28 font-bold text-black leading-p-120 mb-6">
          {{ t('rewards.learn_more_title') }}
        </h3>

        <!-- Info Items -->
        <div class="flex flex-col gap-4">
          <div
            v-for="(item, index) in infoItems"
            :key="item.icon"
            class="flex items-start gap-3"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              :class="
                index < 3
                  ? 'bg-background-brand-subtle'
                  : 'bg-background-default'
              "
            >
              <AppIcon
                name="arrow-path-rounded-square"
                size="xxs"
                v-if="item.icon === 'swap'"
                class="text-text-brand"
              />
              <AppIcon
                name="trophy"
                variant="filled"
                size="xxs"
                v-else-if="item.icon === 'trophy'"
                class="text-text-brand"
              />
              <trade-icon
                v-else-if="item.icon === 'trade'"
                class="w-4 h-4 text-text-brand"
              />
              <AppIcon
                name="currency-dollar"
                variant="filled"
                size="xxs"
                v-else-if="item.icon === 'currency-dollar'"
                class="text-text-brand"
              />
              <AppIcon
                name="calendar"
                variant="filled"
                size="xxs"
                v-else-if="item.icon === 'calendar'"
                class="text-text-muted"
              />
              <AppIcon
                name="wallet"
                size="xxs"
                v-else-if="item.icon === 'wallet-icon'"
                class="text-text-muted"
              />
              <AppIcon
                name="banknotes"
                size="xxs"
                v-else-if="item.icon === 'wallet-balance'"
                class="text-text-muted"
              />
              <AppIcon
                name="currency-dollar"
                variant="filled"
                size="xxs"
                v-else-if="item.icon === 'currency-dollar-gray'"
                class="text-text-muted"
              />
              <AppIcon
                name="face-frown"
                variant="filled"
                size="xxs"
                v-else-if="item.icon === 'face-frown'"
                class="text-text-muted"
              />
            </div>
            <p class="text-s-14 text-text-subtle leading-snug pt-1">
              {{ item.text }}
            </p>
          </div>
        </div>

        <!-- Divider -->
        <hr class="my-6 border-t border-border-default" />

        <rewards-rows
          v-if="!isBanned"
          :trade-claimed="tradeClaimed"
          :trade-no-rewards="tradeNoRewards"
          :trade-paused="isRewardsPaused"
          :trade-remaining-pct="tradeRemainingPct"
          :trade-remaining-count="tradeRemainingCount"
          :trade-total="tradeTotal"
          :min-spend-trade="minSpendTrade"
          class="mt-0"
          @trade="onNavigate('trade')"
        />
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import RewardsRows from '@/modules/rewards/RewardsRows.vue'
import TradeIcon from '@/assets/icons/core_menu/icon-trade.vue'
import { analytics, RewardsEvent, RerwadsAndOffersEvent } from '@/analytics'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { useRewardsStore } from '@/stores/rewardsStore'
import { storeToRefs } from 'pinia'
import AppIcon from '@/components/icon/AppIcon.vue'
import Configs from '@/configs'

const props = defineProps<{
  location?:
    | 'main-banner'
    | 'small-banner-swap'
    | 'small-banner-trade'
    | 'small-banner-bridge'
}>()

const isOpenModel = defineModel('isOpen', {
  type: Boolean,
  required: true,
})

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
const { setWalletPanel } = walletMenu
const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)
const toastStore = useToastStore()
const rewardsStore = useRewardsStore()
const {
  isBanned,
  minSpendTrade,
  tradeClaimed,
  tradeNoRewards,
  isRewardsPaused,
  tradeRemainingPct,
  tradeRemainingCount,
  tradeTotal,
} = storeToRefs(rewardsStore)

const { t } = useI18n()

// Rewards program parameters live in configs so copy and thresholds move together.
const REWARD_AMOUNT = Configs.MEW_REWARDS_REWARD_USD
const MAX_USERS_PER_HOUR = Configs.MEW_REWARDS_PER_HOUR
const CAMPAIGN_PERIOD_DAYS = Configs.MEW_REWARDS_PERIOD_DAYS
const MIN_WALLET_AGE_WEEKS = Configs.MEW_REWARDS_MIN_WALLET_AGE_WEEKS
const MIN_RWA_BALANCE_USD = Configs.MEW_REWARDS_MIN_RWA_BALANCE_USD
const RWA_LOOKBACK_WEEKS = Configs.MEW_REWARDS_RWA_LOOKBACK_WEEKS

watch(isOpenModel, val => {
  if (val) {
    analytics.trackRewardsEvent(RewardsEvent.LEARN_MORE_CLICKED, {
      location: props.location,
    })
  }
})

const infoItems = computed(() => [
  {
    icon: 'swap',
    text: t('rewards.info_make_trade', { min: minSpendTrade.value }),
  },
  {
    icon: 'trade',
    text: t('rewards.info_first_users', { count: MAX_USERS_PER_HOUR }),
  },
  {
    icon: 'currency-dollar',
    text: t('rewards.info_earn_per_trade', { amount: REWARD_AMOUNT }),
  },
  {
    icon: 'calendar',
    text: t('rewards.info_one_reward_period', { days: CAMPAIGN_PERIOD_DAYS }),
  },
  {
    icon: 'wallet-icon',
    text: t('rewards.info_wallet_age', { weeks: MIN_WALLET_AGE_WEEKS }),
  },
  {
    icon: 'wallet-balance',
    text: t('rewards.info_min_rwa_balance', {
      amount: MIN_RWA_BALANCE_USD,
      weeks: RWA_LOOKBACK_WEEKS,
    }),
  },
  {
    icon: 'currency-dollar-gray',
    text: t('rewards.info_no_cashout'),
  },
  {
    icon: 'face-frown',
    text: t('rewards.info_no_sybil'),
  },
])

const onNavigate = (panel: 'swap' | 'trade') => {
  if (panel === 'trade') {
    analytics.trackRewardsAndOffersEvent(RerwadsAndOffersEvent.CLICKED_CTA, {
      campaign: 'trade',
      cta: 'trade',
    })
  } else {
    analytics.trackRewardsEvent(RewardsEvent.CLICK_SWAP, {
      location: 'learn-more-dialog',
      type: panel,
    })
  }
  isOpenModel.value = false
  const ETH_NETWORK_NAME = 'ETHEREUM'
  if (selectedNetwork.value !== ETH_NETWORK_NAME) {
    globalStore.setSelectedNetwork(ETH_NETWORK_NAME)
    toastStore.addToastMessage({
      text: t('rewards.switched_to_ethereum'),
    })
  }
  setWalletPanel(panel)
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
}
</script>

<style scoped></style>
