<script setup lang="ts">
import { computed, inject, provide, useTemplateRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useSortable } from '@vueuse/integrations/useSortable'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppPagination from '@/components/pagination/AppPagination.vue'
import AppSkeleton from '@/components/skeleton/AppSkeleton.vue'
import AppTableRow from './AppTableRow.vue'
import AppTableCell from './AppTableCell.vue'
import {
  COLUMN_SPACING,
  ROW_PADDING,
  TABLE_CONTEXT,
  TABLE_WRAPPER,
  tableSizeFor,
  type TableColumn,
  type TableFooterType,
  type TableSize,
  type TableSort,
} from './types'

/**
 * Table (design library, Figma `_Table` 2128:5354 with `.TableHeader`
 * 2129:5690, `_TableHeaderTitle` 1255:4142 and `_TableFooter` 2928:161002).
 * Owns the column model, sort state and size; the rows are AppTableRows in
 * the default slot, so sorting and paging the data stay with the parent.
 *
 * `columns[0]` is the leading (name) column and the rest are data columns.
 * The table is one CSS grid and the header and every row are subgrids of it,
 * so the auto tracks (star, actions) line up across rows. Keep AppTableRows
 * as direct children of the slot: a wrapper element breaks the subgrid.
 *
 * Size: the `size` prop, else the AppTableWrapper around it, else the table's
 * own width (768 / 1280). At S only the leading and primary columns show;
 * `largeOnly` columns show at L only.
 * Sort cycles off → desc → asc → off per column (`v-model:sort`); with
 * `defaultSort`, "off" is that sort instead of null. `loading` swaps the rows
 * for `loadingRows` skeleton rows and blanks the pagination label.
 */
const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    ariaLabel?: string
    size?: TableSize
    /** Reserve the start track for the rows' watchlist star. */
    watchlist?: boolean
    /** Drag handles on hover (mouse and touch); emits `reorder`. */
    reorderable?: boolean
    /** Reserve the end track for the rows' `#actions`. */
    actions?: boolean
    /** What a third click returns to (instead of null): the data's own order. */
    defaultSort?: TableSort
    loading?: boolean
    loadingRows?: number
    footer?: TableFooterType
    pages?: number
    /** Overrides the pagination footer's "Showing page X of Y" copy. */
    paginationLabel?: (page: number, total: number) => string
    /** Count for the "Show N more" footer. */
    remaining?: number
    /** Height cap class (e.g. `max-h-96`); the rows scroll under the header. */
    maxHeight?: string
  }>(),
  { pages: 1, remaining: 0, loadingRows: 5 },
)

const sort = defineModel<TableSort | null>('sort', { default: null })
const page = defineModel<number>('page', { default: 1 })
const emit = defineEmits<{
  'show-more': []
  reorder: [move: { from: number; to: number }]
}>()

const { t } = useI18n()

const root = useTemplateRef<HTMLElement>('root')
const { width } = useElementSize(root, undefined, { box: 'border-box' })
const wrapper = inject(TABLE_WRAPPER, null)
const size = computed<TableSize>(
  () => props.size ?? wrapper?.size.value ?? tableSizeFor(width.value),
)

const leading = computed(() => props.columns[0])
const dataColumns = computed(() => props.columns.slice(1))
const visibleData = computed(() => {
  if (size.value === 'l') return dataColumns.value
  if (size.value === 'm') return dataColumns.value.filter(c => !c.largeOnly)
  const primary = dataColumns.value.find(c => c.primary) ?? dataColumns.value[0]
  return primary ? [primary] : []
})
const visibleKeys = computed(() => visibleData.value.map(c => c.key))
const start = computed(() => props.watchlist || props.reorderable)

const template = computed(() => {
  const n = visibleData.value.length
  return [
    start.value && 'auto',
    'minmax(0,1fr)',
    n && `repeat(${n}, calc(var(--spacing) * ${COLUMN_SPACING[size.value]}))`,
    props.actions && 'auto',
  ]
    .filter(Boolean)
    .join(' ')
})

provide(TABLE_CONTEXT, {
  size,
  visibleKeys,
  start,
  reorderable: computed(() => props.reorderable),
  actions: computed(() => props.actions),
})

const directionOf = (col: TableColumn) =>
  sort.value?.key === col.key ? sort.value.direction : null

const ariaSort = (col: TableColumn) => {
  const direction = directionOf(col)
  if (direction) return direction === 'asc' ? 'ascending' : 'descending'
  return col.sortable ? 'none' : undefined
}

const onSort = (col: TableColumn) => {
  const direction = directionOf(col)
  sort.value =
    direction === 'asc'
      ? (props.defaultSort ?? null)
      : { key: col.key, direction: direction === 'desc' ? 'asc' : 'desc' }
}

// SortableJS (touch included) drags a row by its handle. It moves the DOM
// node itself, so the move is undone here and the parent reorders the data.
const body = useTemplateRef<HTMLElement>('body')
const { option } = useSortable(body, [], {
  handle: '[data-table-handle]',
  disabled: !props.reorderable,
  // The fields used here; sortablejs's own types aren't a direct dependency.
  onUpdate: ({
    item,
    from,
    oldIndex,
    newIndex,
  }: {
    item: HTMLElement
    from: HTMLElement
    oldIndex?: number
    newIndex?: number
  }) => {
    item.remove()
    from.insertBefore(item, from.children[oldIndex ?? 0] ?? null)
    if (oldIndex !== undefined && newIndex !== undefined)
      emit('reorder', { from: oldIndex, to: newIndex })
  },
})
watch(
  () => props.reorderable,
  on => option('disabled', !on),
)
</script>

<template>
  <div ref="root" class="flex w-full flex-col gap-6">
    <div
      role="table"
      :aria-label="ariaLabel"
      :aria-labelledby="ariaLabel ? undefined : wrapper?.titleId"
      :aria-busy="loading || undefined"
      :class="['grid', size === 's' ? 'gap-x-1' : 'gap-x-2']"
      :style="{ gridTemplateColumns: template }"
    >
      <div
        role="row"
        :class="[
          'col-span-full grid grid-cols-subgrid items-center',
          ROW_PADDING[size],
        ]"
      >
        <div v-if="start" role="columnheader">
          <span v-if="watchlist" class="sr-only">
            {{ t('common.watchlist') }}
          </span>
        </div>
        <div
          v-for="(col, i) in [leading, ...visibleData]"
          :key="col.key"
          role="columnheader"
          :aria-sort="ariaSort(col)"
          :class="[
            'flex h-5 min-w-0 items-center',
            { 'justify-end': size === 's' && i > 0 },
          ]"
        >
          <button
            v-if="col.sortable"
            type="button"
            :class="[
              'flex min-w-0 items-center gap-1 rounded-8 text-overline transition-colors hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus',
              directionOf(col) ? 'text-text-default' : 'text-text-subtle',
            ]"
            @click="onSort(col)"
          >
            <span class="truncate">{{ col.label }}</span>
            <AppIcon
              v-if="directionOf(col)"
              :name="directionOf(col) === 'asc' ? 'arrow-up' : 'arrow-down'"
              size="xxs"
            />
          </button>
          <span v-else class="truncate text-overline text-text-subtle">
            {{ col.label }}
          </span>
        </div>
        <div v-if="actions" role="columnheader">
          <span class="sr-only">{{ t('common.actions') }}</span>
        </div>
      </div>

      <div
        ref="body"
        role="rowgroup"
        :class="[
          'col-span-full grid grid-cols-subgrid',
          maxHeight && ['overflow-y-auto', maxHeight],
        ]"
      >
        <template v-if="loading">
          <AppTableRow v-for="n in loadingRows" :key="n">
            <template #leading>
              <AppSkeleton
                shape="circle"
                :class="size === 's' ? 'size-8' : 'size-10'"
              />
              <span class="flex flex-col gap-2">
                <AppSkeleton class="h-3 w-16" />
                <AppSkeleton class="h-3 w-24" />
              </span>
            </template>
            <AppTableCell v-for="key in visibleKeys" :key="key" :column="key">
              <AppSkeleton class="h-3 w-16" />
            </AppTableCell>
          </AppTableRow>
        </template>
        <slot v-else :size="size" :visible-keys="visibleKeys" />
      </div>
    </div>

    <div v-if="footer === 'show-more'" class="flex items-center gap-4">
      <AppDivider class="flex-1" />
      <AppBaseButton
        type="tertiary"
        surface="alternative"
        size="medium"
        @click="emit('show-more')"
      >
        {{ t('common.show_count_more', { count: remaining }) }}
      </AppBaseButton>
      <AppDivider class="flex-1" />
    </div>
    <AppPagination
      v-else-if="footer === 'pagination'"
      v-model="page"
      :total-pages="pages"
      :label="loading ? () => '' : paginationLabel"
      variant="alternative"
    />
  </div>
</template>
