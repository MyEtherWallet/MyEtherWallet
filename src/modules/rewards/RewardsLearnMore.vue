<template>
  <app-dialog v-model:is-open="isOpenModel" class="sm:max-w-[440px] sm:mx-auto">
    <template #content>
      <div class="px-6 py-6 flex flex-col">
        <!-- Title -->
        <!-- <h3 class="text-s-28 font-bold leading-p-120 text-primary">Trade</h3> -->
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
              :class="index < 3 ? 'bg-blue-10' : 'bg-grey-5'"
            >
              <arrow-path-rounded-square-icon
                class="w-4 h-4 text-primary"
                v-if="item.icon === 'swap'"
              />
              <trophy-icon
                v-else-if="item.icon === 'trophy'"
                class="w-4 h-4 text-primary"
              />
              <trade-icon
                v-else-if="item.icon === 'trade'"
                class="w-4 h-4 text-primary"
              />
              <currency-dollar-icon
                v-else-if="item.icon === 'currency-dollar'"
                class="w-4 h-4 text-primary"
              />
              <calendar-icon
                v-else-if="item.icon === 'calendar'"
                class="w-4 h-4 text-grey-50"
              />
              <wallet-icon
                v-else-if="item.icon === 'wallet-icon'"
                class="w-4 h-4 text-grey-50"
              />
              <currency-dollar-icon
                v-else-if="item.icon === 'currency-dollar-gray'"
                class="w-4 h-4 text-grey-50"
              />
              <face-frown-icon
                v-else-if="item.icon === 'face-frown'"
                class="w-4 h-4 text-grey-50"
              />
            </div>
            <p class="text-s-14 text-info leading-snug pt-1">
              {{ item.text }}
            </p>
          </div>
        </div>

        <!-- Divider -->
        <hr class="my-6 border-t border-grey-10" />

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
          :time-until-hour-reset="timeUntilHourReset"
          :time-until-swap-next-eligible="timeUntilSwapNextEligible"
          :time-until-trade-next-eligible="timeUntilTradeNextEligible"
          :time-until-market-open="timeUntilMarketOpen"
          :min-spend-trade="minSpendTrade"
          class="mt-0"
          :has-swap="false"
          :has-trade="true"
          @swap="onNavigate('swap')"
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
import {
  TrophyIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  FaceFrownIcon,
} from '@heroicons/vue/24/solid'
import TradeIcon from '@/assets/icons/core_menu/icon-trade.vue'
import {
  ArrowPathRoundedSquareIcon,
  WalletIcon,
} from '@heroicons/vue/24/outline'
import { analytics, RewardsEvent, RerwadsAndOffersEvent } from '@/analytics'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useToastStore } from '@/stores/toastStore'
import { useRewardsStore } from '@/stores/rewardsStore'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  location?:
    | 'main-banner'
    | 'small-banner-swap'
    | 'small-banner-trade'
    | 'small-banner-bridge'
  swapClaimed: boolean | null
  swapNoRewards: boolean
  swapRemainingPct: number
  swapRemainingCount: number | null
  swapTotal: number | null
  tradeClaimed: boolean | null
  tradeNoRewards: boolean
  tradeMarketClosed: boolean
  tradeRemainingPct: number
  tradeRemainingCount: number | null
  tradeTotal: number | null
  timeUntilHourReset: string
  timeUntilSwapNextEligible: string
  timeUntilTradeNextEligible: string
  timeUntilMarketOpen: string
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
const { isBanned, minSpendTrade } = storeToRefs(rewardsStore)

const { t } = useI18n()

// Rewards program parameters — update these to change the displayed values
const MIN_TRADE_AMOUNT = 25
const MAX_USERS_PER_HOUR = 15
const REWARD_AMOUNT = 5
const CAMPAIGN_PERIOD_DAYS = 7

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
    text: t('rewards.info_make_trade', {
      min: minSpendTrade.value || MIN_TRADE_AMOUNT,
    }),
  },
  {
    icon: 'trade',
    text: t('rewards.earn_rewards_description', {
      trade_count: 10,
      trade_minimum: 25,
      reward_amount: 5,
    }),
  },
  // {
  //   icon: 'trophy',
  //   text: 'Be among the first 10 users per hour, per swap.',
  // },
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
    text: t('rewards.info_wallet_age'),
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
