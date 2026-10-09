<template>
  <rewards-learn-more v-model:is-open="isOpenModel" location="main-banner" />
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import RewardsLearnMore from '@/modules/rewards/RewardsLearnMore.vue'
import { useRewardsStore } from '@/stores/rewardsStore'
import { useRwaAnnouncementStore } from '@/stores/rwaAnnouncementStore'

const isOpenModel = defineModel<boolean>('isOpen', { default: false })

// Published so the weekend-trading tooltip can hold off while this is up.
// Reported here rather than at the call site so every caller is covered.
const { setTradeInfoOpen } = useRwaAnnouncementStore()
watch(isOpenModel, open => setTradeInfoOpen(open), { immediate: true })

const rewardsStore = useRewardsStore()

onMounted(() => {
  rewardsStore.fetchPool()
})

onUnmounted(() => {
  // Navigating away with the modal open counts as closing it — otherwise the
  // flag stays set and holds the tooltip off for the rest of the session.
  if (isOpenModel.value) setTradeInfoOpen(false)
})
</script>
