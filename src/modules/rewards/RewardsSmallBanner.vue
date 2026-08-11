<template>
  <!-- Every location except the swap one advertises the hold campaign ("Trade,
       hold and get 10 USDC"), so those are hidden once it stops taking trades. -->
  <div v-if="!isBanned && (isSwapLocation || canRegisterTrade)">
    <div
      class="bg-brand-subtle rounded-2xl flex items-center gap-3 px-3 py-3 cursor-pointer shadow-sm relative mb-3"
      @click="onLearnMore"
    >
      <div class="flex-1 min-w-0">
        <div class="text-s-11 font-semibold text-fg leading-tight">
          <div v-if="props.location === 'small-banner-swap'">
            {{ t('rewards.small_banner_swap_text') }}
            <span class="text-brand">
              {{ t('rewards.small_banner_swap_highlight') }}</span
            >
          </div>
          <div v-else>
            {{ t('rewards.small_banner_trade_text') }}
            <span class="text-brand">
              {{ t('rewards.small_banner_trade_highlight') }}</span
            >
            <br />
            {{ t('rewards.small_banner_trade_sub') }}
          </div>
        </div>
      </div>
      <button
        class="flex items-center gap-1 text-s-14 text-fg underline whitespace-nowrap hoverOpacity shrink-0"
      >
        {{ t('rewards.learn_more') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHoldingsStore } from '@/stores/holdingsStore'

const { t } = useI18n()

const props = defineProps<{
  location: 'small-banner-swap' | 'small-banner-trade' | 'small-banner-bridge'
}>()

const rewardsStore = useRewardsStore()
const { isBanned } = storeToRefs(rewardsStore)

const holdingsStore = useHoldingsStore()
const { canRegisterTrade } = storeToRefs(holdingsStore)

const isSwapLocation = computed(() => props.location === 'small-banner-swap')

const onLearnMore = () => {
  holdingsStore.openModal()
}
</script>

<style scoped></style>
