<template>
  <div class="flex flex-col gap-5 xs:gap-3">
    <!-- Trade Row -->
    <div
      class="flex items-center justify-between gap-3"
      :class="{
        'flex-wrap  xs:flex-nowrap items-start xs:items-center': isRewardsView,
      }"
    >
      <div class="flex items-center gap-3 min-w-40">
        <div
          class="rounded-lg p-1.5 flex-none h-10 w-10 flex items-center justify-center"
          :class="[
            isActive ? 'bg-background-brand-subtle' : 'bg-background-default',
          ]"
        >
          <icon-trade
            class="w-6 h-6"
            :class="[isActive ? 'text-text-brand' : 'text-text-placeholder']"
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
          <template v-if="isActive">
            <div
              class="w-full h-1.5 bg-background-brand-subtle rounded-full overflow-hidden mt-1 flex"
            >
              <div
                class="h-full bg-background-brand rounded-full transition-all"
                :style="{ width: `${tradeRemainingPct}%` }"
              />
            </div>
            <p class="text-s-12 text-text-brand mt-0.5 leading-[18px]">
              <b>{{ tradeRemainingCount ?? '—' }}/{{ tradeTotal ?? '—' }}</b>
              {{ t('rewards.rewards_left_label') }}
            </p>
          </template>
          <p
            v-else-if="tradeClaimed"
            class="text-s-12 font-medium mt-0.5 text-text-success"
          >
            {{ t('rewards.reward_claimed') }}
          </p>
          <p
            v-else-if="tradePaused"
            class="text-s-12 font-medium mt-0.5 text-text-error"
          >
            {{ t('rewards.rewards_paused') }}
          </p>
          <p v-else class="text-s-12 font-medium mt-0.5 text-text-error">
            {{ t('rewards.no_rewards_left') }}
          </p>
        </div>
      </div>
      <app-base-button
        v-if="isActive"
        size="small"
        is-outline
        class="grow max-w-[150px]"
        @click="$emit('trade')"
      >
        {{ t('rewards.trade_button', { amount: `$${minSpendTrade}+` }) }}
      </app-base-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useI18n } from 'vue-i18n'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'
import Configs from '@/configs'

const walletMenuStore = useWalletMenuStore()
const { t } = useI18n()
const rewardAmount = Configs.MEW_REWARDS_REWARD_USD
const { isOpenSideMenu } = storeToRefs(walletMenuStore)

const props = defineProps<{
  tradeClaimed: boolean
  tradeNoRewards: boolean
  tradePaused: boolean
  tradeRemainingPct: number
  tradeRemainingCount: number | null
  tradeTotal: number | null
  minSpendTrade: string
  isRewardsView?: boolean
}>()

defineEmits<{
  trade: []
}>()

const isActive = computed(
  () => !props.tradeClaimed && !props.tradeNoRewards && !props.tradePaused,
)
</script>
