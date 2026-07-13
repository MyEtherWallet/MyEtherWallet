// src/modules/global-search/types.ts
export interface SearchResultItem {
  id: string
  symbol: string
  name: string
  icon?: string
  priceUsd: number | null
  change24hPct: number | null
  isStock: boolean
}

export type SectionKey = 'stocks' | 'crypto'
