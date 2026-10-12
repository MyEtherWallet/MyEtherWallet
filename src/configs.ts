const mewWalletUrl =
  import.meta.env.VITE_MEW_WALLET_API || 'https://qa.mewwallet.dev'

// Build target: 'production' or 'dev', set per environment through
// VITE_BUILD_MODE and defaulting to 'dev' when unset. Deliberately independent
// of Vite's own `MODE`: a release build must set VITE_BUILD_MODE=production.
// Every environment switch in the app reads `Configs.BUILD_MODE`.
const BUILD_MODES = ['production', 'dev'] as const
export type BuildMode = (typeof BUILD_MODES)[number]

const isBuildMode = (value: string): value is BuildMode =>
  (BUILD_MODES as readonly string[]).includes(value)

const resolveBuildMode = (): BuildMode => {
  const value = import.meta.env.VITE_BUILD_MODE
  if (!value) return 'dev'
  // A misspelt value (e.g. "prod") must not silently run as dev: that would
  // point a release at dev endpoints. Fail loudly at startup instead.
  if (!isBuildMode(value)) {
    throw new Error(
      `Invalid VITE_BUILD_MODE "${value}": expected one of ${BUILD_MODES.join(', ')}`,
    )
  }
  return value
}

const buildMode = resolveBuildMode()

// Rewards V2 backend: prod in production builds, dev everywhere else. The
// rules URL below hangs off it, so one override moves both.
const rewardsApiUrl =
  import.meta.env.VITE_MEW_REWARDS_API ||
  (buildMode === 'production'
    ? 'https://mew-rewards-v2-prod.ethvm.dev'
    : 'https://mew-rewards-v2-dev.ethvm.dev')

// Strapi serves uploads from the host root (`/uploads/...`), not from `/api`,
// so the host is the shared constant and the API path hangs off it.
const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'https://strapi.mewapi.io'

const configs = {
  WALLET_CONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
    '72299ce67c7d5c879dd8da2df1a6875b',
  MEW_API_URL: import.meta.env.VITE_MEW_API || 'https://mew-api-dev.ethvm.dev',
  MEW_PURCHASE_BASE_URL: mewWalletUrl,
  MEW_PURCHASE_API: `${mewWalletUrl}/v5/purchase/info`,
  MEW_EXCHANGE_RATES_API: `${mewWalletUrl}/v2/prices/exchange-rates`,
  MEW_EMAIL: `${mewWalletUrl}/email-web`,
  IS_DEV_MODE: false,
  MEW_DONATION_ADDRESS: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  POPULAR_CHAINS: [
    'ETHEREUM',
    'BSC',
    'BITCOIN',
    'POLYGON',
    'POLYGON_ZKEVM',
    'BASE',
    'GNOSIS',
    'ROOTSTOCK',
  ],
  /** Rewards V2 API, selected by build mode (see `rewardsApiUrl`). */
  MEW_REWARDS_API_URL: rewardsApiUrl,
  /**
   * Campaign rules: minimum trade, minimum maintained balance and how long it
   * must be held, reward asset and amount. Kept as its own entry so it can be
   * repointed without touching the rest of the API.
   */
  MEW_REWARDS_RULES_URL: `${rewardsApiUrl}/v1/rewards/rules`,
  /**
   * Shown until `/v1/rewards/rules` answers; the live rule overrides every
   * value here. Keep in step with the campaign so the first paint is right.
   */
  MEW_REWARDS_FALLBACK_RULES: {
    MIN_SPEND_USD: 250,
    REWARD_AMOUNT: '5',
    REWARD_ASSET: 'USDC',
    MIN_RWA_BALANCE_USD: 100,
    HOLD_DURATION_DAYS: 14,
  },
  /** Program terms the rules endpoint does not carry. */
  MEW_REWARDS_MIN_WALLET_AGE_WEEKS: 2,
  MEW_REWARDS_PER_HOUR: 15,
  MEW_REWARDS_PERIOD_DAYS: 7,
  STRAPI_CMS_URL: strapiUrl,
  STRAPI_CMS_API: `${strapiUrl}/api`,
  RWA_REWARDS_API: `${mewWalletUrl}/rwa-rewards/season2`,
  /** Rewards marketing page: terms & conditions and the full rewards list. */
  REWARDS_PAGE_URL: 'https://myetherwallet.com/rewards',
  MEW_MOBILE_DOWNLOAD_URL: 'https://download.mewwallet.com',
  MEW_SENTRY_DSN:
    import.meta.env.VITE_SENTRY_DSN ||
    'https://3779ba7db0670350a396d35fbeb766c0@o382951.ingest.us.sentry.io/4511061868347392',
  VINTAGE: 'https://www.myetherwallet.com/wallet/access',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.0.0',
  INTERCOM_APP_ID: import.meta.env.VITE_INTERCOM_ID || undefined,
  TRADING_RESTRICTION: import.meta.env.VITE_TRADING_RESTRICTION || 'off',
  // Watchlist (home banner + table + onboarding) stays hidden unless the env var
  // is explicitly 'true', so it can be flipped per environment.
  SHOW_WATCHLIST: import.meta.env.VITE_WATCHLIST_ENABLED === 'true',
  BUILD_MODE: buildMode,
}

export default configs
