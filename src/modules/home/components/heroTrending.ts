import type { RouteLocationRaw } from 'vue-router'

/**
 * Normalized shape shared by the Hero's trending cards (stocks and crypto), so
 * both data sources map onto the same AppTokenListRow UI.
 */
export interface TrendingRowItem {
  logo?: string
  symbol: string
  name?: string
  isStock: boolean
  price: number
  /** 24h change as a number (positive = gain). */
  change: number
  to: RouteLocationRaw
}
