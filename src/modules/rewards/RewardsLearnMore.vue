<template>
  <app-dialog v-model:is-open="isOpenModel" class="sm:max-w-[440px] sm:mx-auto">
    <template #content>
      <div class="px-6 py-6 flex flex-col">
        <!-- Title -->
        <!-- <h3 class="text-s-28 font-bold leading-p-120 text-primary">Trade</h3> -->
        <h3 class="text-s-28 font-bold text-black leading-p-120 mb-6">
          Earn USDC rewards
        </h3>

        <!-- Info Items -->
        <div class="flex flex-col gap-4">
          <div
            v-for="(item, index) in infoItems"
            :key="item.text"
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
import { watch } from 'vue'
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
import { analytics, RewardsEvent } from '@/analytics'
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
const { isBanned } = storeToRefs(rewardsStore)

watch(isOpenModel, val => {
  if (val) {
    analytics.trackRewardsEvent(RewardsEvent.LEARN_MORE_CLICKED, {
      location: props.location,
    })
  }
})

const infoItems = [
  {
    icon: 'swap',
    text: 'Make a trade over $100.',
  },
  // {
  //   icon: 'trophy',
  //   text: 'Be among the first 10 users per hour, per swap.',
  // },
  {
    icon: 'trade',
    text: 'Be among the first 15 users per hour, per trade.',
  },
  {
    icon: 'currency-dollar',
    text: 'Earn 5 USDC per trade.',
  },
  {
    icon: 'calendar',
    text: 'Up to one reward per wallet per 7 day campaign period, sent directly to your wallet',
  },
  {
    icon: 'wallet-icon',
    text: 'The wallet must be at least 2 weeks old (relative to the current date) and hold a minimum balance of 0.001 ETH.',
  },
  {
    icon: 'face-frown',
    text: 'Wallets suspected of exploiting the rewards program through Sybil attacks (creating multiple accounts to claim more rewards) or other manipulative tactics will be disqualified.',
  },
]

const onNavigate = (panel: 'swap' | 'trade') => {
  analytics.trackRewardsEvent(RewardsEvent.CLICK_SWAP, {
    location: 'learn-more-dialog',
  })
  isOpenModel.value = false
  const ETH_NETWORK_NAME = 'ETHEREUM'
  if (selectedNetwork.value !== ETH_NETWORK_NAME) {
    globalStore.setSelectedNetwork(ETH_NETWORK_NAME)
    toastStore.addToastMessage({
      text: 'Switched app network to Ethereum',
    })
  }
  setWalletPanel(panel)
  if (!isOpenSideMenu.value) {
    walletMenu.setIsOpenSideMenu(true)
  }
}
</script>

<style scoped></style>
