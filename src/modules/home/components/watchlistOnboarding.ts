/**
 * Static config + types for the "build your watchlist" onboarding wizard
 * (MEW-2130). Markets and industries are plain arrays so the product can edit
 * the offered options without touching component logic.
 */

export type WatchlistMarketId = 'stocks' | 'crypto' | 'perps'

export interface WatchlistMarket {
  id: WatchlistMarketId
  /** i18n key under homePage.hero.watchlist.onboarding.marketLabels */
  labelKey: string
}

export const WATCHLIST_MARKETS: WatchlistMarket[] = [
  { id: 'stocks', labelKey: 'stocks' },
  { id: 'crypto', labelKey: 'crypto' },
  { id: 'perps', labelKey: 'perps' },
]

/**
 * Offered industries. Each entry maps to an i18n key under
 * homePage.hero.watchlist.onboarding.industryLabels — edit this list (and the
 * locale files) to change what the grid shows.
 */
export const WATCHLIST_INDUSTRIES: string[] = [
  'commodities',
  'equities',
  'tech',
  'ai',
  'hardware',
  'gaming',
  'transport',
  'software',
  'construction',
  'privacy',
  'infrastructure',
  'etfs',
]

export type RecommendedAssetType = 'crypto' | 'stock' | 'perp'

export interface RecommendedAsset {
  /** Stable id for selection tracking (unique within the response). */
  id: string
  symbol: string
  name: string
  logoUrl?: string
  type: RecommendedAssetType
  /** Value handed to the store: coinId (crypto) | stock symbol | baseCurrency (perp). */
  watchlistId: string
}

/**
 * Placeholder recommendations used until the backend endpoint is live. Mixes
 * crypto and Ondo tokenized stocks to mirror the Figma design.
 */
export const MOCK_RECOMMENDED_ASSETS: RecommendedAsset[] = [
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', type: 'crypto', watchlistId: 'usd-coin' }, // prettier-ignore
  { id: 'spot', symbol: 'SPOTon', name: 'Spotify', type: 'stock', watchlistId: 'SPOT' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', type: 'crypto', watchlistId: 'ethereum' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', type: 'crypto', watchlistId: 'tether' },
  { id: 'nvda', symbol: 'NVDAon', name: 'NVIDIA', type: 'stock', watchlistId: 'NVDA' },
  { id: 'weth', symbol: 'WETH', name: 'Wrapped Ether', type: 'crypto', watchlistId: 'weth' }, // prettier-ignore
  { id: 'orcl', symbol: 'ORCLon', name: 'Oracle', type: 'stock', watchlistId: 'ORCL' },
  { id: 'uber', symbol: 'UBERon', name: 'Uber', type: 'stock', watchlistId: 'UBER' },
  { id: 'wbtc', symbol: 'WBTC', name: 'Wrapped Bitcoin', type: 'crypto', watchlistId: 'wrapped-bitcoin' }, // prettier-ignore
  { id: 'aapl', symbol: 'AAPLon', name: 'Apple', type: 'stock', watchlistId: 'AAPL' },
  { id: 'rddt', symbol: 'RDDTon', name: 'Reddit', type: 'stock', watchlistId: 'RDDT' },
  { id: 'abnb', symbol: 'ABNBon', name: 'Airbnb', type: 'stock', watchlistId: 'ABNB' },
  { id: 'tsla', symbol: 'TSLAon', name: 'Tesla', type: 'stock', watchlistId: 'TSLA' }, // prettier-ignore
  { id: 'msft', symbol: 'MSFTon', name: 'Microsoft', type: 'stock', watchlistId: 'MSFT' }, // prettier-ignore
  { id: 'amzn', symbol: 'AMZNon', name: 'Amazon', type: 'stock', watchlistId: 'AMZN' }, // prettier-ignore
  { id: 'googl', symbol: 'GOOGLon', name: 'Alphabet', type: 'stock', watchlistId: 'GOOGL' }, // prettier-ignore
  { id: 'meta', symbol: 'METAon', name: 'Meta', type: 'stock', watchlistId: 'META' }, // prettier-ignore
  { id: 'coin', symbol: 'COINon', name: 'Coinbase', type: 'stock', watchlistId: 'COIN' }, // prettier-ignore
  { id: 'pltr', symbol: 'PLTRon', name: 'Palantir', type: 'stock', watchlistId: 'PLTR' }, // prettier-ignore
  { id: 'sol', symbol: 'SOL', name: 'Solana', type: 'crypto', watchlistId: 'solana' },
  { id: 'link', symbol: 'LINK', name: 'Chainlink', type: 'crypto', watchlistId: 'chainlink' }, // prettier-ignore
  { id: 'uni', symbol: 'UNI', name: 'Uniswap', type: 'crypto', watchlistId: 'uniswap' }, // prettier-ignore
  { id: 'dai', symbol: 'DAI', name: 'Dai', type: 'crypto', watchlistId: 'dai' },
  { id: 'btc-perp', symbol: 'BTC', name: 'Bitcoin Perpetual', type: 'perp', watchlistId: 'BTC' }, // prettier-ignore
]
