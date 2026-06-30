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
          :class="[!swapClaimed && !swapNoRewards ? 'bg-blue-10' : 'bg-grey-5']"
        >
          <icon-swap
            class="w-6 h-6"
            :class="[
              !swapClaimed && !swapNoRewards
                ? ' text-primary'
                : 'text-[#A5A5A5]',
            ]"
          />
        </div>
        <div class="flex-1 min-w-0">
          <span
            class="text-s-14 font-semibold leading-[20px]"
            :class="{
              '2xl:text-s-13 3xl:text-s-14': isOpenSideMenu,
            }"
            >Swap and Earn $5</span
          >
          <template v-if="!swapClaimed && !swapNoRewards">
            <div
              class="w-full h-1.5 bg-blue-10 rounded-full overflow-hidden mt-1 flex"
            >
              <div
                class="h-full bg-primary rounded-full transition-all"
                :style="{ width: `${swapRemainingPct}%` }"
              />
            </div>
            <p class="text-s-12 text-primary mt-0.5 leading-[18px]">
              <b>{{ swapRemainingCount ?? '—' }}/{{ swapTotal ?? '—' }}</b>
              rewards left
            </p>
          </template>
          <p
            v-else-if="swapClaimed"
            class="text-s-12 font-medium mt-0.5 text-success"
          >
            Reward claimed
          </p>
          <p v-else class="text-s-12 font-medium mt-0.5 text-error">
            No rewards left
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
        Swap $50+
      </app-base-button>
      <button
        v-else
        class="flex items-center gap-1 grow text-s-11 xs:text-s-13 text-[#A5A5A5] font-medium px-3 py-[6px] border-[1.5px] border-dashed border-[#A5A5A5] rounded-full max-w-[150px]"
        :class="{
          '2xl:text-s-11 3xl:text-s-13': isOpenSideMenu,
        }"
      >
        Back in
        {{ swapClaimed ? timeUntilSwapNextEligible : timeUntilHourReset }}
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
              ? 'bg-blue-10'
              : 'bg-grey-5',
          ]"
        >
          <icon-trade
            class="w-6 h-6"
            :class="[
              !tradeClaimed && !tradeNoRewards && !tradeMarketClosed
                ? 'text-primary'
                : 'text-[#A5A5A5]',
            ]"
          />
        </div>
        <div class="flex-1 min-w-0">
          <span
            class="text-s-14 font-semibold leading-[20px]"
            :class="{
              '2xl:text-s-13 3xl:text-s-14': isOpenSideMenu,
            }"
            >Trade and Earn $5</span
          >
          <template
            v-if="!tradeClaimed && !tradeNoRewards && !tradeMarketClosed"
          >
            <div
              class="w-full h-1.5 bg-blue-10 rounded-full overflow-hidden mt-1 flex"
            >
              <div
                class="h-full bg-primary rounded-full transition-all"
                :style="{ width: `${tradeRemainingPct}%` }"
              />
            </div>
            <p class="text-s-12 text-primary mt-0.5 leading-[18px]">
              <b>{{ tradeRemainingCount ?? '—' }}/{{ tradeTotal ?? '—' }}</b>
              rewards left
            </p>
          </template>
          <p
            v-else-if="tradeClaimed"
            class="text-s-12 font-medium mt-0.5 text-success"
          >
            Reward claimed
          </p>
          <p
            v-else-if="tradeMarketClosed"
            class="text-s-12 font-medium mt-0.5 text-error"
          >
            Market is closed
          </p>
          <p v-else class="text-s-12 font-medium mt-0.5 text-error">
            No rewards left
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
        Trade $35+
      </app-base-button>
      <button
        v-else
        class="flex items-center gap-1 grow text-s-11 xs:text-s-13 text-[#A5A5A5] font-medium px-3 py-[6px] border-[1.5px] border-dashed border-[#A5A5A5] rounded-full max-w-[150px]"
        :class="{
          '2xl:text-s-11 3xl:text-s-13': isOpenSideMenu,
        }"
      >
        Back in
        {{
          tradeClaimed
            ? timeUntilTradeNextEligible
            : tradeMarketClosed
              ? timeUntilMarketOpen
              : timeUntilHourReset
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
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'

const walletMenuStore = useWalletMenuStore()
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
}>()

defineEmits<{
  swap: []
  trade: []
}>()
</script>
