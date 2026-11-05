import type { CellRightAccessory } from '@/components/cell/cellSizes'

/**
 * One row (or quick-pick card) of the token selector. Callers map their own
 * token type into this and get `raw` back on `select`.
 */
export interface TokenSelectorItem<T = unknown> {
  /** Unique within the list it's rendered in. */
  id: string
  symbol: string
  name: string
  logo?: string | null
  /** Network badge for this row; falls back to the modal's `networkIcon`. */
  chainIcon?: string | null
  rightAccessory?: CellRightAccessory
  disabled?: boolean
  raw: T
}

export interface TokenSelectorNetwork {
  /** `null` stands for "all networks". */
  value: string | null
  name: string
  icon?: string | null
  disabled?: boolean
}

export interface TokenSelectorSortOption {
  value: string
  label: string
}

export type TokenSelectorSortDirection = 'asc' | 'desc'
