/**
 * Static config + types for the "build your watchlist" onboarding wizard
 * (MEW-2130). Markets and industries are plain arrays so the product can edit
 * the offered options without touching component logic.
 */
import loaderCrypto1 from '@/assets/images/watchlist/market-crypto-1.png'
import loaderStocks1 from '@/assets/images/watchlist/market-stocks-1.png'
import loaderCrypto2 from '@/assets/images/watchlist/market-crypto-2.png'
import loaderStocks2 from '@/assets/images/watchlist/market-stocks-2.png'
import loaderCrypto3 from '@/assets/images/watchlist/market-crypto-3.png'
import loaderStocks3 from '@/assets/images/watchlist/market-stocks-3.png'
import loaderPerps1 from '@/assets/images/watchlist/market-perps-1.png'

export type WatchlistMarketId = 'stocks' | 'crypto'

// Logos for the step-3 loading conveyor. Bundled here (not in the step
// component) so the dialog can preload them the moment the wizard opens — by
// step 3 they're already cached, no cold-start flash.
export const WATCHLIST_LOADER_LOGOS: string[] = [
  loaderCrypto1,
  loaderStocks1,
  loaderCrypto2,
  loaderStocks2,
  loaderCrypto3,
  loaderStocks3,
  loaderPerps1,
]

// Kick off the image downloads (idempotent — the browser dedupes/caches).
export const preloadWatchlistLoaderLogos = (): void => {
  for (const src of WATCHLIST_LOADER_LOGOS) {
    new Image().src = src
  }
}

export interface WatchlistMarket {
  id: WatchlistMarketId
  /** i18n key under homePage.hero.watchlist.onboarding.marketLabels */
  labelKey: string
}

export const WATCHLIST_MARKETS: WatchlistMarket[] = [
  { id: 'stocks', labelKey: 'stocks' },
  { id: 'crypto', labelKey: 'crypto' },
]

// Step 2 offers the curated-collection categories from `@/modules/home/sectors`
// (scoped to the markets picked in step 1) — no separate industries list.

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
