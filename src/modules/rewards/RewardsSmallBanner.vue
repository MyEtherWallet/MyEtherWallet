<template>
  <div
    class="rewards-banner-bg flex items-center justify-between gap-1 rounded-full px-2 py-2 cursor-pointer text-[10px] mb-3 md:-mx-1"
    @click="onLearnMore"
  >
    <p class="font-medium">
      First 100 swaps or trades each day over $10 get $5 USDC
    </p>
    <button class="font-bold underline whitespace-nowrap hoverOpacity">
      Learn More
    </button>
  </div>
  <rewards-learn-more v-model:is-open="isLearnMoreOpen" :location="props.location" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RewardsLearnMore from '@/modules/rewards/RewardsLearnMore.vue'

const props = defineProps<{
  location: 'small-banner-swap' | 'small-banner-trade' | 'small-banner-bridge'
}>()

const isLearnMoreOpen = ref(false)

const onLearnMore = () => {
  isLearnMoreOpen.value = true
}
</script>

<style scoped>
.rewards-banner-bg {
  background: linear-gradient(90deg, #c7b8ff 0%, #d1e1ff 100%);
}
</style>
