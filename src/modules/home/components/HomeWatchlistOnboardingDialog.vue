<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useRecommendedWatchlist } from '@/modules/home/composables/useRecommendedWatchlist'
import {
  useWatchlistCategories,
  marketsToTypes,
} from '@/modules/home/composables/useWatchlistCategories'
import WatchlistStepMarkets from './WatchlistStepMarkets.vue'
import WatchlistStepIndustries from './WatchlistStepIndustries.vue'
import WatchlistStepAssets from './WatchlistStepAssets.vue'
import findingAssetsAnimation from '@/assets/images/watchlist/finding-assets.lottie?url'

const isOpen = defineModel<boolean>('isOpen', { required: true })

const watchlistStore = useWatchlistStore()
const {
  assets,
  isLoading: isLoadingAssets,
  fetchRecommendations,
} = useRecommendedWatchlist()
const {
  categories,
  isLoading: isLoadingCategories,
  fetchCategories,
} = useWatchlistCategories()

// Step 3 shows the loader while either the categories (skip path) or the assets
// are still resolving.
const isLoadingStep3 = computed(
  () => isLoadingCategories.value || isLoadingAssets.value,
)

const activeStep = ref(0)
const selectedMarkets = ref<string[]>([])
// Category ids picked in step 2 (e.g. "STOCK:Equities").
const selectedCategoryIds = ref<string[]>([])
const selectedAssetIds = ref<string[]>([])

const reset = () => {
  activeStep.value = 0
  selectedMarkets.value = []
  selectedCategoryIds.value = []
  selectedAssetIds.value = []
}

// Continue from step 1 → fetch the categories offered for the picked markets.
const goToIndustries = () => {
  activeStep.value = 1
  fetchCategories(marketsToTypes(selectedMarkets.value))
}

// Back from industries → markets. Selections are kept (refs untouched) so the
// user sees their prior picks (AC: back preserves prior selections).
const goToMarkets = () => {
  activeStep.value = 0
}

// Continue from step 2 → recommend the assets in the picked categories.
const goToAssets = () => {
  activeStep.value = 2
  fetchRecommendations(selectedCategoryIds.value)
}

// Skipping step 1 discards its market picks (only Continue commits them; the
// refs are left untouched so they reappear on back) and opens the assets step
// on every category across both markets.
const skipFromMarkets = async () => {
  activeStep.value = 2
  const cats = await fetchCategories(['STOCK', 'CRYPTO'])
  fetchRecommendations(cats.map(c => c.id))
}

// Skipping step 2 keeps the step-1 markets but drops the category question —
// recommend across every category offered for those markets.
const skipFromIndustries = () => {
  activeStep.value = 2
  fetchRecommendations(categories.value.map(c => c.id))
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
          :categories="categories"
          :is-loading="isLoadingCategories"
          @continue="goToAssets"
          @back="goToMarkets"
          @skip="skipFromIndustries"
          @close="close"
        />
        <WatchlistStepAssets
          v-else
          v-model="selectedAssetIds"
          :assets="assets"
          :is-loading="isLoadingStep3"
          @done="finish"
          @back="goToIndustries"
          @close="close"
        />
      </div>
    </template>
  </AppDialog>
</template>
