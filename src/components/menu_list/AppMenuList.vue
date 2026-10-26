<script setup lang="ts">
import { nextTick, ref, useSlots } from 'vue'
import AppSearchbar from '@/components/AppSearchbar.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import { flattenVNodes } from '@/utils/flattenVNodes'
import { useMenuListKeyboard } from './useMenuListKeyboard'
import type { MenuListRole } from './types'

/**
 * Menu List (design library, MEW-2466, Figma 873:4728). "Searchable list of
 * selectable options, combining a search field with rows built from Cell,
 * separated by dividers, and a scroll indicator." Only the panel: whoever opens
 * it (a Dropdown) owns placement, open state and Escape, and the parent filters
 * its own rows from `v-model:search`.
 *
 * Rows are consumer `AppCell size="small" inset` in the default slot. In a
 * listbox pass `role="option"` and `:aria-selected`, in a menu
 * `role="menuitem"`; a Cell otherwise stays `role="button"`. Attrs land on the
 * panel, `listClass` on the scrolling rows region (its max height).
 *
 * @example
 * <AppMenuList v-model:search="query" aria-label="Networks">
 *   <AppCell v-for="n in shown" :key="n.id" size="small" inset role="option" :aria-selected="n.id === picked" :title="n.name" @click="pick(n)" />
 * </AppMenuList>
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Figma `showSearchbar`. */
    searchable?: boolean
    /** Falls back to the Searchbar's localized `common.search`. */
    searchPlaceholder?: string
    /** Figma `showScrollBar`; off, the rows still scroll with the bar hidden. */
    scrollbar?: boolean
    role?: MenuListRole
    /** Accessible name of the listbox / menu. */
    ariaLabel?: string
    /** Names the listbox / menu by another element, e.g. a Dropdown trigger. */
    ariaLabelledby?: string
    /** Id of the listbox / menu itself, for a trigger's `aria-controls`. */
    listId?: string
    /** A divider between every row; leave off to place group dividers by hand. */
    divided?: boolean
    /** Classes for the scrolling rows region, e.g. its max height. */
    listClass?: string
  }>(),
  {
    searchable: true,
    searchPlaceholder: '',
    scrollbar: true,
    role: 'listbox',
    ariaLabel: undefined,
    ariaLabelledby: undefined,
    listId: undefined,
    divided: false,
    listClass: 'max-h-80',
  },
)

const search = defineModel<string>('search', { default: '' })

const slots = useSlots()

const searchWrapper = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)

const searchInput = () =>
  searchWrapper.value?.querySelector<HTMLInputElement>('input') ?? null

const focusSearch = () => searchInput()?.focus()

// Typeahead from a row: the key lands at the end of the query and the caret
// after it, as if it had been typed in the field.
const typeIntoSearch = async (key: string) => {
  search.value = `${search.value}${key}`
  await nextTick()
  const input = searchInput()
  if (!input) return
  input.focus()
  input.setSelectionRange(input.value.length, input.value.length)
}

const { focusRow, onFocusIn, onKeydown } = useMenuListKeyboard({
  list,
  searchable: () => props.searchable,
  focusSearch,
  typeIntoSearch,
})

const slotRows = () => flattenVNodes(slots.default?.())

defineExpose({ focusSearch, focusRow })
</script>

<template>
  <div
    v-bind="$attrs"
    data-testid="menu-list"
    class="flex flex-col rounded-16 bg-background-alternative p-1 shadow-button"
  >
    <div
      v-if="searchable"
      ref="searchWrapper"
      class="pb-2"
      @keydown.down.prevent="focusRow(0)"
    >
      <AppSearchbar
        v-model="search"
        variant="default"
        :placeholder="searchPlaceholder"
      />
    </div>

    <!-- The native scrollbar is the Figma ScrollBar: 8px pill 4px off the rows. -->
    <div
      ref="list"
      :id="listId"
      :role="role"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabelledby"
      data-testid="menu-list-rows"
      class="flex min-w-0 flex-col overflow-y-auto"
      :class="[
        scrollbar ? 'menu-list-scrollbar pr-1' : 'no-scrollbar',
        listClass,
      ]"
      @keydown="onKeydown"
      @focusin="onFocusIn"
    >
      <template v-if="divided">
        <template v-for="(row, index) in slotRows()" :key="row.key ?? index">
          <AppDivider v-if="index" aria-hidden="true" />
          <component :is="row" />
        </template>
      </template>
      <slot v-else />
    </div>
  </div>
</template>

<style scoped>
/* Blink/WebKit take the exact Figma geometry; Firefox only knows thin + colour.
   The gutter stays reserved so rows don't shift once the list overflows. */
.menu-list-scrollbar {
  scrollbar-gutter: stable;
}

.menu-list-scrollbar::-webkit-scrollbar {
  width: var(--size-2);
}

.menu-list-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.menu-list-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background: var(--color-background-default-hover);
}

@supports not selector(::-webkit-scrollbar) {
  .menu-list-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-background-default-hover) transparent;
  }
}
</style>
