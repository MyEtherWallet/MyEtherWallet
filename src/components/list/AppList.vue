<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { CELL_SURFACE_BG_CLASS } from '@/components/cell/cellSizes'
import { flattenVNodes } from '@/utils/flattenVNodes'
import ListHeader from './ListHeader.vue'
import {
  LIST_CONTAINER_CLASS,
  LIST_GRID_DEFAULT_CLASS,
  LIST_ROWS_CLASS,
  type ListProps,
} from './types'

/**
 * List (design library, MEW-2467, Figma 2287:17344). "Vertical stack of rows
 * built from Cell, InfoCell, or Card, used to display collections of assets,
 * transactions, or other items." Layout only: the consumer renders the rows
 * (`AppCell`, with `inset` inside the `rows` container) or the cards; the list
 * owns the header, the container and the spacing.
 *
 * Every slotted child is wrapped in a `role="listitem"`, so screen readers
 * announce "list, N items" and still read each row as itself. Attrs land on
 * the `<section>`.
 *
 * @example
 * <AppList title="Assets" header="inside">
 *   <AppCell v-for="a in assets" :key="a.id" inset :title="a.name" />
 * </AppList>
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ListProps>(), {
  layout: 'rows',
  header: 'none',
  title: '',
  description: '',
  action: undefined,
  surface: 'default',
  gridClass: LIST_GRID_DEFAULT_CLASS,
})

const emit = defineEmits<{ action: [] }>()

const slots = useSlots()

const slotRows = () => flattenVNodes(slots.default?.())

// Figma only draws the header inside the `rows` container.
const placement = computed(() =>
  props.header === 'inside' && props.layout !== 'rows'
    ? 'outside'
    : props.header,
)

const rowsClass = computed(() => [
  LIST_ROWS_CLASS[props.layout],
  props.layout === 'grid' ? props.gridClass : '',
])
</script>

<template>
  <section
    v-bind="$attrs"
    data-testid="list"
    :aria-label="placement === 'none' ? undefined : title"
    class="flex w-full flex-col"
    :class="{ 'gap-3': placement === 'outside' }"
  >
    <ListHeader
      v-if="placement === 'outside'"
      size="l"
      :title="title"
      :description="description"
      :action="action"
      @action="emit('action')"
    >
      <template v-if="$slots['header-extra']" #extra>
        <slot name="header-extra" />
      </template>
      <template v-if="$slots['header-action']" #action>
        <slot name="header-action" />
      </template>
    </ListHeader>

    <!-- Only `rows` draws a container; spaced rows and cards carry their own fill. -->
    <div
      :class="
        layout === 'rows'
          ? [LIST_CONTAINER_CLASS, CELL_SURFACE_BG_CLASS[surface]]
          : 'flex flex-col'
      "
    >
      <ListHeader
        v-if="placement === 'inside'"
        size="m"
        :title="title"
        :action="action"
        @action="emit('action')"
      >
        <template v-if="$slots['header-extra']" #extra>
          <slot name="header-extra" />
        </template>
        <template v-if="$slots['header-action']" #action>
          <slot name="header-action" />
        </template>
      </ListHeader>

      <div role="list" data-testid="list-rows" :class="rowsClass">
        <div
          v-for="(row, index) in slotRows()"
          :key="row.key ?? index"
          role="listitem"
          class="min-w-0"
        >
          <component :is="row" />
        </div>
      </div>
    </div>
  </section>
</template>
