export interface IndustrySector {
  id: string
  labelKey: string
  market: 'stocks' | 'crypto'
  filter: string
}

// Researched stock sector/category filters (MEW-2069).
const STOCK_FILTERS = [
  'Equities',
  'Stock',
  'Large Cap',
  'US',
  'Growth',
  'Technology',
  'ETF',
  'Value',
  'Small Cap',
  'Industrials',
] as const

// The live crypto explore filters (src/modules/crypto/ModuleExploreCrypto.vue
// `cryptoFilterOptions`) mix non-sector view modes (all tokens, top gainers,
// top losers, watchlist) with only ~3 sector-like categories (stablecoins,
// defi-index, meme-token/tiktok-meme) — not enough for a clean 6-item sector
// list in the same style as the stock filters above. Per the task brief's
// fallback ("otherwise use a documented placeholder list of 6"), this is a
// documented placeholder list of common crypto industry-sector categories.
const CRYPTO_FILTERS = [
  'DeFi',
  'Layer 1',
  'Stablecoins',
  'Meme',
  'Gaming',
  'AI',
] as const

export const sectors: IndustrySector[] = [
  ...STOCK_FILTERS.map(
    (f): IndustrySector => ({
      id: `stocks-${f}`,
      labelKey: `homePage.sectors.labels.${f}`,
      market: 'stocks',
      filter: f,
    }),
  ),
  ...CRYPTO_FILTERS.map(
    (f): IndustrySector => ({
      id: `crypto-${f}`,
      labelKey: `homePage.sectors.labels.${f}`,
      market: 'crypto',
      filter: f,
    }),
  ),
]

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
