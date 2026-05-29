<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      :class="[
        'bg-white rounded-20 shadow-popup z-20 overflow-hidden flex flex-col max-h-[80vh]',
        isCompact
          ? 'fixed left-2 right-2 top-[72px] max-w-[420px] mx-auto'
          : 'absolute top-full left-0 right-0 mt-2',
      ]"
    >
      <div
        v-if="isCompact"
        class="flex items-center gap-2 px-4 py-3 border-b border-mewBg"
      >
        <magnifying-glass-icon class="w-4 h-4 text-info" />
        <input
          ref="compactInputEl"
          v-model="query"
          type="text"
          :placeholder="$t('search.placeholder')"
          class="flex-1 bg-transparent outline-none text-s-14 placeholder:text-info"
        />
        <button class="text-s-13 font-medium text-primary" @click="close">
          {{ $t('search.cancel') }}
        </button>
      </div>
      <div v-auto-animate class="overflow-y-auto flex-1 min-h-0 pb-2">
        <recently-viewed-chips v-if="!query" />

        <global-search-section
          :title="$t('search.ondo_stocks')"
          :subtitle="$t('search.by_market_cap')"
          :items="stocks"
          :is-loading="isLoadingStocks"
          :expanded="expanded.stocks"
          @select="selectAsset"
          @toggle-expand="toggleExpand('stocks')"
        />

        <global-search-section
          :title="$t('search.crypto')"
          :subtitle="$t('search.by_market_cap')"
          :items="crypto"
          :is-loading="isLoadingCrypto"
          :expanded="expanded.crypto"
          @select="selectAsset"
          @toggle-expand="toggleExpand('crypto')"
        />

        <div
          v-if="showEmptyState"
          class="flex flex-col items-center justify-center gap-1 px-4 py-10 text-center"
        >
          <magnifying-glass-icon class="w-8 h-8 text-info mb-1" />
          <p class="text-s-14 font-semibold">
            {{ $t('search.no_results_title') }}
          </p>
          <p class="text-s-12 text-info">
            {{ $t('search.no_results_subtitle') }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useGlobalSearch } from '../composables/useGlobalSearch'
import GlobalSearchSection from './GlobalSearchSection.vue'
import RecentlyViewedChips from './RecentlyViewedChips.vue'

const props = withDefaults(
  defineProps<{ isCompact?: boolean }>(),
  { isCompact: false },
)

const {
  isOpen,
  query,
  debouncedQuery,
  stocks,
  crypto,
  isLoadingStocks,
  isLoadingCrypto,
  expanded,
  toggleExpand,
  selectAsset,
  close,
} = useGlobalSearch()

const showEmptyState = computed(() => {
  if (!debouncedQuery.value) return false
  if (isLoadingStocks.value || isLoadingCrypto.value) return false
  return stocks.value.length === 0 && crypto.value.length === 0
})

const compactInputEl = ref<HTMLInputElement | null>(null)
watch(isOpen, async open => {
  if (!open || !props.isCompact) return
  await nextTick()
  compactInputEl.value?.focus()
})

const route = useRoute()
watch(() => route.fullPath, () => {
  if (isOpen.value) close()
})
</script>
