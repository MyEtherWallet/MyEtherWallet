import type { Component } from 'vue'
import {
  ClockIcon,
  GiftIcon,
  ChartPieIcon,
  BuildingOffice2Icon,
  ChevronUpIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  CubeIcon,
  BanknotesIcon,
  FaceSmileIcon,
  PuzzlePieceIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'

export interface IndustrySector {
  id: string
  labelKey: string
  market: 'stocks' | 'crypto'
  filter: string
  /** Solid tile background — the exact Figma color-token hex. */
  color: string
  /** Heroicon rendered white inside the translucent bubble. */
  icon: Component
}

// Colors + icons come 1:1 from the Figma "IndustrySectorTile" set
// (design-library node 873:5582): a solid colored card with a translucent
// white icon bubble top-right and a bold white label bottom-left. `color` is
// the Figma color-token hex; `icon` is the exact heroicon used per tile.
function make(
  market: 'stocks' | 'crypto',
  slug: string,
  filter: string,
  color: string,
  icon: Component,
): IndustrySector {
  return {
    id: `${market}-${slug}`,
    labelKey: `homePage.sectors.labels.${slug}`,
    market,
    filter,
    color,
    icon,
  }
}

// Hardcoded list (no sector API yet). Stocks mirror the Figma tiles exactly.
const STOCK_SECTORS: IndustrySector[] = [
  make('stocks', 'rwas', '24/7 RWAs', '#684cff', ClockIcon),
  make('stocks', 'consumer', 'Consumer', '#f31b6f', GiftIcon),
  make('stocks', 'etfs', 'ETFs', '#e27d00', ChartPieIcon),
  make('stocks', 'financials', 'Financials', '#c16cff', BuildingOffice2Icon),
  make('stocks', 'growth', 'Growth', '#067f71', ChevronUpIcon),
  make('stocks', 'technology', 'Technology', '#4d1ee3', CpuChipIcon),
  make('stocks', 'value', 'Value', '#cc0452', BuildingOffice2Icon),
  make('stocks', 'commodities', 'Commodities', '#ffa500', BuildingOffice2Icon),
]

// Crypto tab: same tile style, a hardcoded set of common crypto sectors
// (the Figma only speced the stocks tab). Colors reuse the same palette.
const CRYPTO_SECTORS: IndustrySector[] = [
  make('crypto', 'defi', 'DeFi', '#684cff', CurrencyDollarIcon),
  make('crypto', 'layer1', 'Layer 1', '#f31b6f', CubeIcon),
  make('crypto', 'stablecoins', 'Stablecoins', '#e27d00', BanknotesIcon),
  make('crypto', 'meme', 'Meme', '#c16cff', FaceSmileIcon),
  make('crypto', 'gaming', 'Gaming', '#067f71', PuzzlePieceIcon),
  make('crypto', 'ai', 'AI', '#4d1ee3', SparklesIcon),
]

export const sectors: IndustrySector[] = [...STOCK_SECTORS, ...CRYPTO_SECTORS]

// NOTE: neither /stocks nor /crypto currently reads a `sector` query param
// (verified: no query handling exists on either page). This deep-link
// carries intent only — navigation to the base route still works, but the
// destination page won't yet pre-filter by sector. Wiring that up is a
// downstream dependency, out of scope for this PR.
export function sectorLink(s: IndustrySector): {
  path: string
  query: Record<string, string>
} {
  return {
    path: s.market === 'stocks' ? '/stocks' : '/crypto',
    query: { sector: s.filter },
  }
}
