<template>
  <div v-if="items.length > 0 || isLoading" class="py-2">
    <div class="px-4 py-2 flex items-baseline gap-2">
      <span class="text-s-11 font-bold uppercase tracking-sp-06">
        {{ title }}
      </span>
      <span class="text-s-11 text-info">· {{ subtitle }}</span>
    </div>

    <template v-if="items.length === 0 && isLoading">
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
    </template>

    <transition
      v-else
      name="grow"
      @enter="onGrowEnter"
      @after-enter="onGrowAfterEnter"
      @leave="onGrowLeave"
      @after-leave="onGrowAfterLeave"
    >
      <div :key="expanded ? 'all' : 'collapsed'" class="overflow-hidden">
        <global-search-result-row
          v-for="item in visibleItems"
          :key="item.id"
          :item="item"
          @select="$emit('select', $event)"
        />
      </div>
    </transition>

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

const onGrowEnter = (el: Element) => {
  const h = (el as HTMLElement).scrollHeight
  ;(el as HTMLElement).style.height = '0px'
  void (el as HTMLElement).offsetHeight
  ;(el as HTMLElement).style.transition = 'height 140ms cubic-bezier(0.4, 0, 0.2, 1)'
  ;(el as HTMLElement).style.height = `${h}px`
}
const onGrowAfterEnter = (el: Element) => {
  ;(el as HTMLElement).style.height = ''
  ;(el as HTMLElement).style.transition = ''
}
const onGrowLeave = (el: Element) => {
  const h = (el as HTMLElement).scrollHeight
  ;(el as HTMLElement).style.height = `${h}px`
  void (el as HTMLElement).offsetHeight
  ;(el as HTMLElement).style.transition = 'height 140ms cubic-bezier(0.4, 0, 0.2, 1)'
  ;(el as HTMLElement).style.height = '0px'
}
const onGrowAfterLeave = (el: Element) => {
  ;(el as HTMLElement).style.height = ''
  ;(el as HTMLElement).style.transition = ''
}
</script>
