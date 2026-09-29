import type { IconName } from '@/components/icon/icons'

export interface IndustrySector {
  id: string
  labelKey: string
  market: 'stocks' | 'crypto'
  /** Filter value the destination page reads from `?category=` to preselect. */
  filter: string
  /** Solid tile background — reuses the Figma tile palette. */
  color: string
  /** Design-library icon name rendered white inside the translucent bubble. */
  icon: IconName
}

// Figma tile palette (design-library "IndustrySectorTile", node 1082:2605):
// the 10 distinct colors, cycled across the tiles.
const PALETTE = [
  '#684cff',
  '#f31b6f',
  '#e27d00',
  '#c16cff',
  '#067f71',
  '#4d1ee3',
  '#cc0452',
  '#ffa500',
  '#9d00ff',
  '#05c0a5',
]

function make(
  market: 'stocks' | 'crypto',
  labelKey: string,
  filter: string,
  icon: IconName,
  index: number,
): IndustrySector {
  return {
    id: `${market}-${filter}`,
    labelKey,
    market,
    filter,
    color: PALETTE[index % PALETTE.length],
    icon,
  }
}

// Stocks tab: the All-Stocks table categories (MEW-2069, Ondo endpoint), in the
// same order as the /stocks filter. `filter` matches the table's category
// value so a tile deep-links straight into that filtered view. Labels reuse the
// stocks category strings so there is a single source of truth.
const STOCK_SECTORS: IndustrySector[] = [
  make('stocks', 'stocks.category_equities', 'EQUITIES', 'chart-bar', 0),
  make('stocks', 'stocks.category_stock', 'STOCK', 'building-office-2', 1),
  make('stocks', 'stocks.category_large_cap', 'LARGE_CAP', 'building-library', 2),
  make('stocks', 'stocks.category_us', 'US', 'flag', 3),
  make('stocks', 'stocks.category_growth', 'GROWTH', 'arrow-trending-up', 4),
  make('stocks', 'stocks.category_technology', 'TECHNOLOGY', 'cpu-chip', 5),
  make('stocks', 'stocks.category_etf', 'ETF', 'chart-pie', 6),
  make('stocks', 'stocks.category_value', 'VALUE', 'tag', 7),
  make('stocks', 'stocks.category_small_cap', 'SMALL_CAP', 'building-storefront', 8),
  make('stocks', 'stocks.category_industrials', 'INDUSTRIALS', 'wrench-screwdriver', 9),
]

// Crypto tab: the categories currently live in the /crypto filter (Coingecko),
// minus watchlist. `filter` matches the crypto filter value for deep-linking.
const CRYPTO_SECTORS: IndustrySector[] = [
  make('crypto', 'crypto.top_gainers', 'topGainers', 'arrow-trending-up', 0),
  make('crypto', 'crypto.top_losers', 'topLosers', 'arrow-trending-down', 1),
  make('crypto', 'crypto.stablecoins', 'stablecoins', 'banknotes', 2),
  make('crypto', 'crypto.defi', 'defi-index', 'currency-dollar', 3),
  make('crypto', 'crypto.meme', 'meme-token', 'face-smile', 4),
  make('crypto', 'crypto.tiktok', 'tiktok-meme', 'musical-note', 5),
]

export const sectors: IndustrySector[] = [...STOCK_SECTORS, ...CRYPTO_SECTORS]

// Deep-link into the destination page's filter. /stocks (ModuleAllStock) and
// /crypto (ModuleExploreCrypto) read `?category=` on mount to preselect the tab.
export function sectorLink(s: IndustrySector): {
  path: string
  query: Record<string, string>
} {
  return {
    path: s.market === 'stocks' ? '/stocks' : '/crypto',
    query: { category: s.filter },
  }
}
