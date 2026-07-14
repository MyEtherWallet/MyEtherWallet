<template>
  <div v-if="!isBanned">
    <div
      class="bg-mewBg rounded-2xl flex items-center gap-3 px-3 py-3 cursor-pointer shadow-sm relative mb-3"
      @click="onLearnMore"
    >
      <div class="flex-1 min-w-0">
        <div class="text-s-11 font-semibold text-black leading-tight">
          <div v-if="props.location === 'small-banner-swap'">
            Swap $50+ on Ethereum and
            <span class="text-primary"> Earn 5 USDC</span>
          </div>
          <div v-else>
            Trade, hold and get <span class="text-primary"> 10 USDC</span>
            <br />
            Trade $100 to qualify
          </div>
        </div>
      </div>
      <button
        class="flex items-center gap-1 text-s-14 text-black underline whitespace-nowrap hoverOpacity shrink-0"
      >
        Learn more
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useHoldingsStore } from '@/stores/holdingsStore'

const props = defineProps<{
  location: 'small-banner-swap' | 'small-banner-trade' | 'small-banner-bridge'
}>()

const rewardsStore = useRewardsStore()
const { isBanned } = storeToRefs(rewardsStore)

const holdingsStore = useHoldingsStore()

const onLearnMore = () => {
  holdingsStore.openModal()
}
</script>

<style scoped></style>
