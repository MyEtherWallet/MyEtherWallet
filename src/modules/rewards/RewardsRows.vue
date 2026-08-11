<template>
  <div class="flex flex-col gap-5 xs:gap-3">
    <!-- Swap Row -->
    <div
      v-if="hasSwap"
      class="flex items-center justify-between gap-3"
      :class="{
        'flex-wrap  xs:flex-nowrap items-start xs:items-center': isRewardsView,
      }"
    >
      <div class="flex items-center gap-3 min-w-[160px]">
        <div
          class="rounded-lg p-1.5 flex-none h-10 w-10 flex items-center justify-center"
          :class="[!swapClaimed && !swapNoRewards ? 'bg-brand-subtle' : 'bg-page']"
        >
          <icon-swap
            class="w-6 h-6"
            :class="[
              !swapClaimed && !swapNoRewards
                ? ' text-brand'
                : 'text-fg-muted',
            ]"
          />
        </div>
        <div class="flex-1 min-w-0">
          <span
            class="text-s-14 font-semibold leading-[20px]"
            :class="{
              '2xl:text-s-13 3xl:text-s-14': isOpenSideMenu,
            }"
            >{{
              t('rewards.swap_and_earn', { amount: `$${rewardAmount}` })
            }}</span
          >
          <template v-if="!swapClaimed && !swapNoRewards">
            <div
              class="w-full h-1.5 bg-brand-subtle rounded-full overflow-hidden mt-1 flex"
            >
              <div
                class="h-full bg-brand rounded-full transition-all"
                :style="{ width: `${swapRemainingPct}%` }"
              />
            </div>
            <p class="text-s-12 text-brand mt-0.5 leading-[18px]">
              <b>{{ swapRemainingCount ?? '—' }}/{{ swapTotal ?? '—' }}</b>
              {{ t('rewards.rewards_left_label') }}
            </p>
          </template>
          <p
            v-else-if="swapClaimed"
            class="text-s-12 font-medium mt-0.5 text-success"
          >
            {{ t('rewards.reward_claimed') }}
          </p>
          <p v-else class="text-s-12 font-medium mt-0.5 text-error">
            {{ t('rewards.no_rewards_left') }}
          </p>
        </div>
      </div>
      <app-base-button
        v-if="!swapClaimed && !swapNoRewards"
        size="small"
        is-outline
        class="grow max-w-[150px]"
        @click="$emit('swap')"
      >
        {{ t('rewards.swap_button', { amount: `$${swapMinimumAmount}+` }) }}
      </app-base-button>
      <button
        v-else
        class="flex items-center gap-1 grow text-s-11 xs:text-s-13 text-fg-muted font-medium px-3 py-[6px] border-[1.5px] border-dashed border-line-strong rounded-full max-w-[150px]"
        :class="{
          '2xl:text-s-11 3xl:text-s-13': isOpenSideMenu,
        }"
      >
        {{
          t('rewards.back_in', {
            time: swapClaimed ? timeUntilSwapNextEligible : timeUntilHourReset,
          })
        }}
        <clock-icon
          class="w-3.5 h-3.5 ml-auto"
          :class="{
            '2xl:hidden 3xl:block': isOpenSideMenu,
          }"
        />
      </button>
    </div>

    <!-- Trade Row -->
    <div
      v-if="hasTrade"
      class="flex items-center justify-between gap-3"
      :class="{
        'flex-wrap  xs:flex-nowrap items-start xs:items-center': isRewardsView,
      }"
    >
      <div class="flex items-center gap-3 min-w-[160px]">
        <div
          class="rounded-lg p-1.5 flex-none h-10 w-10 flex items-center justify-center"
          :class="[
            !tradeClaimed && !tradeNoRewards && !tradeMarketClosed
              ? 'bg-brand-subtle'
              : 'bg-page',
          ]"
        >
          <icon-trade
            class="w-6 h-6"
            :class="[
              !tradeClaimed && !tradeNoRewards && !tradeMarketClosed
                ? 'text-brand'
                : 'text-fg-muted',
            ]"
          />
        </div>
        <div class="flex-1 min-w-0">
          <span
            class="text-s-14 font-semibold leading-[20px]"
            :class="{
              '2xl:text-s-13 3xl:text-s-14': isOpenSideMenu,
            }"
            >{{
              t('rewards.trade_and_earn', { amount: `$${rewardAmount}` })
            }}</span
          >
          <template
            v-if="!tradeClaimed && !tradeNoRewards && !tradeMarketClosed"
          >
            <div
              class="w-full h-1.5 bg-brand-subtle rounded-full overflow-hidden mt-1 flex"
            >
              <div
                class="h-full bg-brand rounded-full transition-all"
                :style="{ width: `${tradeRemainingPct}%` }"
              />
            </div>
            <p class="text-s-12 text-brand mt-0.5 leading-[18px]">
              <b>{{ tradeRemainingCount ?? '—' }}/{{ tradeTotal ?? '—' }}</b>
              {{ t('rewards.rewards_left_label') }}
            </p>
          </template>
          <p
            v-else-if="tradeClaimed"
            class="text-s-12 font-medium mt-0.5 text-success"
          >
            {{ t('rewards.reward_claimed') }}
          </p>
          <p
            v-else-if="tradeMarketClosed"
            class="text-s-12 font-medium mt-0.5 text-error"
          >
            {{ t('rewards.market_is_closed') }}
          </p>
          <p v-else class="text-s-12 font-medium mt-0.5 text-error">
            {{ t('rewards.no_rewards_left') }}
          </p>
        </div>
      </div>
      <app-base-button
        v-if="!tradeClaimed && !tradeNoRewards && !tradeMarketClosed"
        size="small"
        is-outline
        class="grow max-w-[150px]"
        @click="$emit('trade')"
      >
        {{ t('rewards.trade_button', { amount: `$${minSpendTrade}+` }) }}
      </app-base-button>
      <button
        v-else
        class="flex items-center gap-1 grow text-s-11 xs:text-s-13 text-fg-muted font-medium px-3 py-[6px] border-[1.5px] border-dashed border-line-strong rounded-full max-w-[150px]"
        :class="{
          '2xl:text-s-11 3xl:text-s-13': isOpenSideMenu,
        }"
      >
        {{
          t('rewards.back_in', {
            time: tradeClaimed
              ? timeUntilTradeNextEligible
              : tradeMarketClosed
                ? timeUntilMarketOpen
                : timeUntilHourReset,
          })
        }}
        <clock-icon
          class="w-3.5 h-3.5 ml-auto"
          :class="{
            '2xl:hidden 3xl:block': isOpenSideMenu,
          }"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import { ClockIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'

const walletMenuStore = useWalletMenuStore()
const { t } = useI18n()
const rewardAmount = 5
const swapMinimumAmount = 50
const { isOpenSideMenu } = storeToRefs(walletMenuStore)

defineProps<{
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
  isRewardsView?: boolean
  hasSwap: boolean
  hasTrade: boolean
  minSpendTrade: string
}>()

defineEmits<{
  swap: []
  trade: []
}>()
</script>
