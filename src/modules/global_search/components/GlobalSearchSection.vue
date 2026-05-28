<template>
  <div v-if="items.length > 0" class="py-2">
    <div class="px-4 py-2 flex items-baseline gap-2">
      <span class="text-s-11 font-bold uppercase tracking-sp-06">
        {{ title }}
      </span>
      <span class="text-s-11 text-info">· {{ subtitle }}</span>
    </div>

    <transition
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

const props = defineProps<{
  title: string
  subtitle: string
  items: SearchResultItem[]
  expanded: boolean
}>()

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
  ;(el as HTMLElement).style.transition = 'height 220ms ease'
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
  ;(el as HTMLElement).style.transition = 'height 220ms ease'
  ;(el as HTMLElement).style.height = '0px'
}
const onGrowAfterLeave = (el: Element) => {
  ;(el as HTMLElement).style.height = ''
  ;(el as HTMLElement).style.transition = ''
}
</script>
