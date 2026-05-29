<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      ref="popoverEl"
      :class="[
        'bg-white rounded-20 shadow-popup z-20 overflow-hidden flex flex-col',
        isMobile
          ? 'fixed inset-x-2 top-16 bottom-2'
          : 'absolute top-full left-0 right-0 mt-2 max-h-[80vh]',
      ]"
    >
      <div class="overflow-y-auto flex-1 min-h-0 pb-2">
        <recently-viewed-chips v-if="!query" />

        <global-search-section
          :title="$t('search.ondo_stocks')"
          :subtitle="$t('search.by_market_cap')"
          :items="stocks"
          :expanded="expanded.stocks"
          @select="selectAsset"
          @toggle-expand="toggleExpand('stocks')"
        />

        <global-search-section
          :title="$t('search.crypto')"
          :subtitle="$t('search.by_market_cap')"
          :items="crypto"
          :expanded="expanded.crypto"
          @select="selectAsset"
          @toggle-expand="toggleExpand('crypto')"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useGlobalSearch } from '../composables/useGlobalSearch'
import GlobalSearchSection from './GlobalSearchSection.vue'
import RecentlyViewedChips from './RecentlyViewedChips.vue'

const {
  isOpen,
  query,
  stocks,
  crypto,
  expanded,
  toggleExpand,
  selectAsset,
  close,
} = useGlobalSearch()

const popoverEl = ref<HTMLElement | null>(null)
onClickOutside(popoverEl, () => {
  if (isOpen.value) close()
})

const route = useRoute()
watch(() => route.fullPath, () => {
  if (isOpen.value) close()
})

const { isXLMinAndUp } = useAppBreakpoints()
const isMobile = computed(() => !isXLMinAndUp.value)
</script>
