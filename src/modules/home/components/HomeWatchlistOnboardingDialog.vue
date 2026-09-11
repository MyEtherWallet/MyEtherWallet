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
import { preloadWatchlistLoaderLogos } from './watchlistOnboarding'

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

// Skipping either step ignores the step-1 market picks and recommends across
// every category of both markets. (/assets needs valid category ids, so we
// resolve them first — there's no "all assets of a type" shortcut on the API.)
const skipToAssets = async () => {
  activeStep.value = 2
  const cats = await fetchCategories(['STOCK', 'CRYPTO'])
  fetchRecommendations(cats.map(c => c.id))
}

// Skip resets the skipped step's selection so navigating back from the assets
// step never shows stale, never-committed picks. Skipping step 1 also clears any
// downstream category picks; skipping step 2 keeps the committed markets.
const skipFromMarkets = () => {
  selectedMarkets.value = []
  selectedCategoryIds.value = []
  skipToAssets()
}
const skipFromIndustries = () => {
  selectedCategoryIds.value = []
  skipToAssets()
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

// Start every run fresh once the dialog closes. On open, eagerly fetch the
// step-3 loader logos so they're cached before the loading state shows.
watch(isOpen, open => {
  if (open) preloadWatchlistLoaderLogos()
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
