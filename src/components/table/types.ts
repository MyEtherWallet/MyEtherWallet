import { ref, type InjectionKey, type Ref } from 'vue'

/**
 * Table design-library types (Figma: MEW Web App — Design Library › Table,
 * TableWrapper 2913:98036, TableRow 2126:16555). Size follows the wrapper
 * breakpoints: L at 1280+, M from 768, S below.
 */
export type TableSize = 'l' | 'm' | 's'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  /** The one data column still shown at size S (default: the first data column). */
  primary?: boolean
}

export interface TableSort {
  key: string
  direction: 'asc' | 'desc'
}

export type TableFooterType = 'pagination' | 'show-more'

export const tableSizeFor = (width: number): TableSize =>
  width >= 1280 ? 'l' : width >= 768 ? 'm' : 's'

/**
 * Data column track in spacing units: 140 / 110 / 96px. Tailwind 4 spacing is
 * dynamic, so 27.5 resolves even though SIZE (sizeScale.ts) has no such token.
 */
export const COLUMN_SPACING: Record<TableSize, number> = {
  l: 35,
  m: 27.5,
  s: 24,
}

/** Header and rows share the padding so their subgrid tracks line up. */
export const ROW_PADDING: Record<TableSize, string> = {
  l: 'px-2',
  m: 'px-2',
  s: 'px-1',
}

export interface TableContext {
  size: Readonly<Ref<TableSize>>
  /** Data column keys rendered at the current size. */
  visibleKeys: Readonly<Ref<string[]>>
  /** Leading track for the drag handle + watchlist star. */
  start: Readonly<Ref<boolean>>
  reorderable: Readonly<Ref<boolean>>
  /** Trailing track for the row actions. */
  actions: Readonly<Ref<boolean>>
}

export const TABLE_CONTEXT: InjectionKey<TableContext> = Symbol('AppTable')

/**
 * From AppTableWrapper: its measured size, so the table follows the card's
 * breakpoints, and its title, which names the table for screen readers.
 */
export const TABLE_WRAPPER: InjectionKey<{
  size: Readonly<Ref<TableSize>>
  title: Readonly<Ref<string>>
}> = Symbol('AppTableWrapper')

/** Rows and cells read this outside an AppTable (e.g. a lone spec mount). */
export const defaultTableContext = (): TableContext => ({
  size: ref('l'),
  visibleKeys: ref([]),
  start: ref(false),
  reorderable: ref(false),
  actions: ref(false),
})
