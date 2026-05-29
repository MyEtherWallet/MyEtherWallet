<template>
  <div v-auto-animate v-if="items.length > 0 || isLoading" class="py-2">
    <div class="px-4 py-2 flex items-baseline gap-2">
      <span class="text-s-11 font-bold uppercase tracking-sp-06">
        {{ title }}
      </span>
      <span class="text-s-11 text-info">· {{ subtitle }}</span>
    </div>

    <div v-if="items.length === 0 && isLoading">
      <div
        v-for="i in collapsedLimit"
        :key="`skeleton-${i}`"
        class="flex items-center gap-3 px-4 py-2"
      >
        <div class="w-8 h-8 rounded-full bg-mewBg animate-pulse" />
        <div class="flex-1 flex flex-col gap-1">
          <div class="h-3 w-20 rounded bg-mewBg animate-pulse" />
          <div class="h-2 w-28 rounded bg-mewBg animate-pulse" />
        </div>
        <div class="flex flex-col items-end gap-1">
          <div class="h-3 w-14 rounded bg-mewBg animate-pulse" />
          <div class="h-2 w-10 rounded bg-mewBg animate-pulse" />
        </div>
      </div>
    </div>

    <div v-else v-auto-animate>
      <global-search-result-row
        v-for="item in visibleItems"
        :key="item.id"
        :item="item"
        @select="$emit('select', $event)"
      />
    </div>

    <button
      v-if="items.length > collapsedLimit"
      class="px-4 py-2 text-s-13 font-medium text-primary"
      @click="$emit('toggle-expand')"
    >
      {{ expanded ? $t('search.show_less') : $t('search.show_more') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GlobalSearchResultRow from './GlobalSearchResultRow.vue'
import type { SearchResultItem } from '../types'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    items: SearchResultItem[]
    expanded: boolean
    isLoading?: boolean
  }>(),
  { isLoading: false },
)

defineEmits<{
  select: [item: SearchResultItem]
  'toggle-expand': []
}>()

const collapsedLimit = 3

const visibleItems = computed(() =>
  props.expanded ? props.items : props.items.slice(0, collapsedLimit),
)
</script>
