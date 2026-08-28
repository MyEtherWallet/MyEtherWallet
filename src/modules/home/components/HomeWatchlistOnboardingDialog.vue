<script setup lang="ts">
import { ref, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useRecommendedWatchlist } from '@/modules/home/composables/useRecommendedWatchlist'
import WatchlistStepMarkets from './WatchlistStepMarkets.vue'
import WatchlistStepIndustries from './WatchlistStepIndustries.vue'
import WatchlistStepAssets from './WatchlistStepAssets.vue'

const isOpen = defineModel<boolean>('isOpen', { required: true })

const watchlistStore = useWatchlistStore()
const { assets, isLoading, fetchRecommendations } = useRecommendedWatchlist()

const activeStep = ref(0)
const selectedMarkets = ref<string[]>([])
const selectedIndustries = ref<string[]>([])
const selectedAssetIds = ref<string[]>([])

const reset = () => {
  activeStep.value = 0
  selectedMarkets.value = []
  selectedIndustries.value = []
  selectedAssetIds.value = []
}

const goToIndustries = () => {
  activeStep.value = 1
}

// Back from industries → markets. Selections are kept (refs untouched) so the
// user sees their prior picks (AC: back preserves prior selections).
const goToMarkets = () => {
  activeStep.value = 0
}

const goToAssets = () => {
  activeStep.value = 2
  fetchRecommendations(selectedMarkets.value, selectedIndustries.value)
}

const finish = () => {
  for (const id of selectedAssetIds.value) {
    const asset = assets.value.find(a => a.id === id)
    if (!asset) continue
    if (asset.type === 'perp') {
      if (!watchlistStore.isWatchListedPerp(asset.watchlistId)) {
        watchlistStore.setWatchlistPerp(asset.watchlistId)
      }
    } else if (!watchlistStore.isWatchListed(asset.watchlistId)) {
      watchlistStore.setWatchlistItem(asset.watchlistId, asset.type === 'stock')
    }
  }
  isOpen.value = false
}

// Start every run fresh once the dialog closes (no back button by design).
watch(isOpen, open => {
  if (!open) reset()
})
</script>

<template>
  <AppDialog
    v-model:is-open="isOpen"
    class="sm:mx-auto sm:w-full sm:max-w-[480px]"
    data-test="watchlist-onboarding-dialog"
  >
    <template #content>
      <!-- Figma modal: 24px padding on all sides (the close button sits at 16px,
           matching AppDialog's absolute top-4/right-4). v-auto-animate smoothly
           animates the modal height as the active step swaps. -->
      <div v-auto-animate class="p-6">
        <WatchlistStepMarkets
          v-if="activeStep === 0"
          v-model="selectedMarkets"
          @continue="goToIndustries"
        />
        <WatchlistStepIndustries
          v-else-if="activeStep === 1"
          v-model="selectedIndustries"
          @continue="goToAssets"
          @back="goToMarkets"
        />
        <WatchlistStepAssets
          v-else
          v-model="selectedAssetIds"
          :assets="assets"
          :is-loading="isLoading"
          @done="finish"
          @back="goToIndustries"
        />
      </div>
    </template>
  </AppDialog>
</template>
