<template>
  <div v-auto-animate v-if="items.length > 0 || isLoading">
    <div class="px-3 pt-2 pb-3 flex items-baseline gap-1.5">
      <span class="text-s-14 text-black">
        {{ title }}
      </span>
      <span class="text-s-14 text-black">·</span>
      <span class="text-s-14 text-[#a5a5a5]">{{ subtitle }}</span>
    </div>

    <div v-if="items.length === 0 && isLoading">
      <div
        v-for="i in collapsedLimit"
        :key="`skeleton-${i}`"
        class="flex items-center gap-3 px-3 py-2"
      >
        <div class="w-8 h-8 rounded-full bg-[#f5f5f5] animate-pulse" />
        <div class="flex-1 flex flex-col gap-1">
          <div class="h-3 w-20 rounded bg-[#f5f5f5] animate-pulse" />
          <div class="h-2 w-28 rounded bg-[#f5f5f5] animate-pulse" />
        </div>
        <div class="flex flex-col items-end gap-1">
          <div class="h-3 w-14 rounded bg-[#f5f5f5] animate-pulse" />
          <div class="h-2 w-10 rounded bg-[#f5f5f5] animate-pulse" />
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
      class="flex items-center justify-center gap-5 w-full px-3 pb-2"
      @click="$emit('toggle-expand')"
    >
      <div class="flex-1 h-px bg-grey-5" />
      <div class="flex items-center gap-1 shrink-0">
        <span class="text-s-12 font-semibold text-black tracking-tight">
          {{ expanded ? $t('search.show_less') : $t('search.show_more') }}
        </span>
        <chevron-down-icon
          class="w-3.5 h-3.5 text-black transition-transform"
          :class="{ 'rotate-180': expanded }"
        />
      </div>
      <div class="flex-1 h-px bg-grey-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
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
