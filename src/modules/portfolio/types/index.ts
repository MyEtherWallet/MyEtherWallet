import type BigNumber from 'bignumber.js'

export interface TokenAllocation {
  name: string
  symbol: string
  icon?: string
  percentage: BigNumber
  formattedPercentage: string
  percentageNumber: number
  usdBalanceFormatted: string
  id?: string
  is_stock?: boolean
  stock_alias?: string
  stock_route?: string
}

/**
 * Allocation doughnut slice colours. These feed a Chart.js canvas, which cannot
 * resolve `var(--color-*)`, so they mirror the semantic `background/decorative-*`
 * tokens as literals. Keep in sync with `main.css`.
 */
export const ALLOCATION_COLORS = [
  '#005ae5', // background/decorative-blue-strong
  '#9d00ff', // background/decorative-violet-strong
  '#f31b6f', // background/decorative-pink
  '#01a08c', // background/decorative-green
  '#ffa500', // background/decorative-orange
  '#767676', // background/decorative-neutral
]
export interface TokenGainOrLoss {
  name: string
  symbol: string
  logo_url?: string
  gainOrLoss: BigNumber
  percentChange: number
  price: number
  id: string
  contract?: string
  is_stock?: boolean
  stock_alias?: string
  stock_route?: string
}
