import type { Component } from 'vue'
import {
  ChartBarIcon,
  BuildingOffice2Icon,
  BuildingLibraryIcon,
  FlagIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CpuChipIcon,
  ChartPieIcon,
  TagIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  FaceSmileIcon,
  MusicalNoteIcon,
  RectangleGroupIcon,
} from '@heroicons/vue/24/outline'

export interface IndustrySector {
  id: string
  labelKey: string
  market: 'stocks' | 'crypto'
  /** Filter value the destination page reads from `?category=` to preselect.
   *  Absent on tiles that point at a section instead of a table filter. */
  filter?: string
  /** Section anchor on the destination page, for tiles that open a section
   *  rather than preselect a filter. Mutually exclusive with `filter`. */
  hash?: string
  /** Solid tile background — reuses the Figma tile palette. */
  color: string
  /** Heroicon rendered white inside the translucent bubble. */
  icon: Component
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
  icon: Component,
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
  // Not a table category — this one opens the Ondo Intelligent Portfolios
  // section on /stocks (ModuleOip.vue), which anchors on `#oip`.
  {
    id: 'stocks-oip',
    labelKey: 'stocks.oip_sector',
    market: 'stocks',
    hash: '#oip',
    color: PALETTE[9],
    icon: RectangleGroupIcon,
  },
  make('stocks', 'stocks.category_equities', 'EQUITIES', ChartBarIcon, 0),
  make('stocks', 'stocks.category_stock', 'STOCK', BuildingOffice2Icon, 1),
  make(
    'stocks',
    'stocks.category_large_cap',
    'LARGE_CAP',
    BuildingLibraryIcon,
    2,
  ),
  make('stocks', 'stocks.category_us', 'US', FlagIcon, 3),
  make('stocks', 'stocks.category_growth', 'GROWTH', ArrowTrendingUpIcon, 4),
  make('stocks', 'stocks.category_technology', 'TECHNOLOGY', CpuChipIcon, 5),
  make('stocks', 'stocks.category_etf', 'ETF', ChartPieIcon, 6),
  make('stocks', 'stocks.category_value', 'VALUE', TagIcon, 7),
  make(
    'stocks',
    'stocks.category_small_cap',
    'SMALL_CAP',
    BuildingStorefrontIcon,
    8,
  ),
  make(
    'stocks',
    'stocks.category_industrials',
    'INDUSTRIALS',
    WrenchScrewdriverIcon,
    9,
  ),
]

// Crypto tab: the categories currently live in the /crypto filter (Coingecko),
// minus watchlist. `filter` matches the crypto filter value for deep-linking.
const CRYPTO_SECTORS: IndustrySector[] = [
  make('crypto', 'crypto.top_gainers', 'topGainers', ArrowTrendingUpIcon, 0),
  make('crypto', 'crypto.top_losers', 'topLosers', ArrowTrendingDownIcon, 1),
  make('crypto', 'crypto.stablecoins', 'stablecoins', BanknotesIcon, 2),
  make('crypto', 'crypto.defi', 'defi-index', CurrencyDollarIcon, 3),
  make('crypto', 'crypto.meme', 'meme-token', FaceSmileIcon, 4),
  make('crypto', 'crypto.tiktok', 'tiktok-meme', MusicalNoteIcon, 5),
]

export const sectors: IndustrySector[] = [...STOCK_SECTORS, ...CRYPTO_SECTORS]

// Deep-link into the destination page's filter. /stocks (ModuleAllStock) and
// /crypto (ModuleExploreCrypto) read `?category=` on mount to preselect the tab.
// Section tiles carry a `hash` instead; the destination section scrolls itself
// into view on mount (see ModuleOip.vue).
export interface SectorLink {
  path: string
  /** Set on filter tiles — preselects the destination table's category tab. */
  query?: Record<string, string>
  /** Set on section tiles — the anchor the destination section scrolls to. */
  hash?: string
}

export function sectorLink(s: IndustrySector): SectorLink {
  const path = s.market === 'stocks' ? '/stocks' : '/crypto'
  if (s.hash) return { path, hash: s.hash }
  return { path, query: { category: s.filter ?? '' } }
}
