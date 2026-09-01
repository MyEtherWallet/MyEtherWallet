<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useRecommendedWatchlist } from '@/modules/home/composables/useRecommendedWatchlist'
import { sectors } from '@/modules/home/sectors'
import WatchlistStepMarkets from './WatchlistStepMarkets.vue'
import WatchlistStepIndustries from './WatchlistStepIndustries.vue'
import WatchlistStepAssets from './WatchlistStepAssets.vue'
import findingAssetsAnimation from '@/assets/images/watchlist/finding-assets.lottie?url'

const isOpen = defineModel<boolean>('isOpen', { required: true })

const watchlistStore = useWatchlistStore()
const { assets, isLoading, fetchRecommendations } = useRecommendedWatchlist()

const activeStep = ref(0)
const selectedMarkets = ref<string[]>([])
// Curated-collection ids picked in step 2 (e.g. "crypto-stablecoins").
const selectedCategoryIds = ref<string[]>([])
const selectedAssetIds = ref<string[]>([])

// Resolve the picked ids to the {market, filter} the recommendations fetch needs.
const selectedCategories = computed(() =>
  selectedCategoryIds.value
    .map(id => sectors.find(s => s.id === id))
    .filter((s): s is (typeof sectors)[number] => Boolean(s))
    .map(s => ({ market: s.market, filter: s.filter })),
)

const reset = () => {
  activeStep.value = 0
  selectedMarkets.value = []
  selectedCategoryIds.value = []
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

// Continue from step 2: fetch with the picked markets + curated collections.
const goToAssets = () => {
  activeStep.value = 2
  fetchRecommendations(selectedMarkets.value, selectedCategories.value)
}

// Skipping step 1 discards its market picks — only Continue commits them (the
// refs are left untouched so the picks reappear if the user navigates back), so
// the assets step opens on the full, unfiltered crypto + stocks list.
const skipFromMarkets = () => {
  activeStep.value = 2
  fetchRecommendations([], [])
}

// Skipping step 2 keeps the step-1 markets (already accepted) but drops the
// category question — fetch those markets unfiltered.
const skipFromIndustries = () => {
  activeStep.value = 2
  fetchRecommendations(selectedMarkets.value, [])
}

// Close from the header X (the dialog owns isOpen; AppDialog's own close is
// hidden so the header can render the button in-row).
const close = () => {
  isOpen.value = false
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

// Prefetch the loader animation on open so the assets step shows it instantly
// (no white flash) — the markets/industries steps give it time to warm the
// cache. Start every run fresh once the dialog closes.
watch(isOpen, open => {
  if (open) fetch(findingAssetsAnimation).catch(() => {})
  else reset()
})
</script>

<template>
  <AppDialog
    v-model:is-open="isOpen"
    hide-close
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
          @skip="skipFromMarkets"
          @close="close"
        />
        <WatchlistStepIndustries
          v-else-if="activeStep === 1"
          v-model="selectedCategoryIds"
          :markets="selectedMarkets"
          @continue="goToAssets"
          @back="goToMarkets"
          @skip="skipFromIndustries"
          @close="close"
        />
        <WatchlistStepAssets
          v-else
          v-model="selectedAssetIds"
          :assets="assets"
          :is-loading="isLoading"
          @done="finish"
          @back="goToIndustries"
          @close="close"
        />
      </div>
    </template>
  </AppDialog>
</template>
