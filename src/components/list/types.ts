import type { IconName } from '@/components/icon/icons'
import type { CellSurface } from '@/components/cell/cellSizes'

/**
 * List design-library types + layout classes (Figma: MEW Web App — Design
 * Library › List, component set 2287:17344). Figma Type maps to `layout` +
 * `header`: default-title in / out of list = `rows` + `inside` / `outside`,
 * Rows with spacing = `spaced`, Grid (cards) = `grid`.
 */
export type ListLayout = 'rows' | 'spaced' | 'grid'

export type ListHeaderPlacement = 'inside' | 'outside' | 'none'

/** Header Button Icon (Figma "Buttcon Icon"); `label` is its accessible name. */
export type ListAction = { icon: IconName; label: string }

// Flat on purpose: Vue merges a union in defineProps into one prop set, so a
// discriminated union wouldn't reject `layout="spaced" header="inside"` in
// templates. AppList resolves that case to `outside` instead.
export type ListProps = {
  layout?: ListLayout
  /** `inside` only applies to `rows`; spaced rows and grids take it outside. */
  header?: ListHeaderPlacement
  title?: string
  /** Shown only with the header outside (Figma Content Group L). */
  description?: string
  action?: ListAction
  /** Container fill of the `rows` layout, as AppCell `surface`. */
  surface?: CellSurface
  /** Grid column classes; defaults to LIST_GRID_DEFAULT_CLASS. */
  gridClass?: string
}

/** The `rows` container: rows inside one padded fill, 2px apart. */
export const LIST_CONTAINER_CLASS =
  'flex flex-col gap-0.5 overflow-hidden rounded-12 p-1'

export const LIST_ROWS_CLASS: Record<ListLayout, string> = {
  rows: 'flex flex-col gap-0.5',
  spaced: 'flex flex-col gap-2',
  grid: 'grid gap-3',
}

export const LIST_GRID_DEFAULT_CLASS =
  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
