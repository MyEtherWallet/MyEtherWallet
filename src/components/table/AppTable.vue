<script setup lang="ts">
import { computed, inject, provide, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppPagination from '@/components/pagination/AppPagination.vue'
import {
  COLUMN_SPACING,
  ROW_PADDING,
  TABLE_CONTEXT,
  TABLE_WRAPPER_SIZE,
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
 * own width (768 / 1280). At S only the leading and primary columns show.
 * Sort cycles off → desc → asc → off per column (`v-model:sort`).
 */
const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    ariaLabel?: string
    size?: TableSize
    /** Reserve the start track for the rows' watchlist star. */
    watchlist?: boolean
    /** Drag handles on hover; emits `reorder` (mouse only). */
    reorderable?: boolean
    /** Reserve the end track for the rows' `#actions`. */
    actions?: boolean
    footer?: TableFooterType
    pages?: number
    /** Count for the "Show N more" footer. */
    remaining?: number
    /** Height cap class (e.g. `max-h-96`); the rows scroll under the header. */
    maxHeight?: string
  }>(),
  { pages: 1, remaining: 0 },
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
const wrapperSize = inject(TABLE_WRAPPER_SIZE, null)
const size = computed<TableSize>(
  () => props.size ?? wrapperSize?.value ?? tableSizeFor(width.value),
)

const leading = computed(() => props.columns[0])
const dataColumns = computed(() => props.columns.slice(1))
const visibleData = computed(() => {
  if (size.value !== 's') return dataColumns.value
  const primary =
    dataColumns.value.find(c => c.primary) ?? dataColumns.value[0]
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
      ? null
      : { key: col.key, direction: direction === 'desc' ? 'asc' : 'desc' }
}

// Native DnD, read once on the rowgroup so rows don't need their index.
const body = useTemplateRef<HTMLElement>('body')
let dragFrom = -1
const rowOf = (e: DragEvent) =>
  (e.target as Element | null)?.closest<HTMLElement>('[role="row"]') ?? null
const rowIndex = (row: HTMLElement | null) =>
  row && body.value ? Array.prototype.indexOf.call(body.value.children, row) : -1

const onDragstart = (e: DragEvent) => {
  if (!props.reorderable) return
  const row = rowOf(e)
  dragFrom = rowIndex(row)
  if (row && e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    // Firefox won't start a drag without data.
    e.dataTransfer.setData('text/plain', '')
    e.dataTransfer.setDragImage(row, 0, 0)
  }
}
const onDragover = (e: DragEvent) => {
  if (props.reorderable && dragFrom >= 0) e.preventDefault()
}
const onDrop = (e: DragEvent) => {
  const to = rowIndex(rowOf(e))
  if (props.reorderable && dragFrom >= 0 && to >= 0 && to !== dragFrom) {
    e.preventDefault()
    emit('reorder', { from: dragFrom, to })
  }
  dragFrom = -1
}
</script>

<template>
  <div ref="root" class="flex w-full flex-col gap-6">
    <div
      role="table"
      :aria-label="ariaLabel"
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
          <span class="sr-only">{{ t('common.watchlist') }}</span>
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
              'flex min-w-0 items-center gap-1 rounded-4 text-overline transition-colors hover:text-text-default focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-border-focus',
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
        @dragstart="onDragstart"
        @dragover="onDragover"
        @drop="onDrop"
      >
        <slot :size="size" :visible-keys="visibleKeys" />
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
      variant="alternative"
    />
  </div>
</template>
