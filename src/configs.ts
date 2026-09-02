const mewWalletUrl = import.meta.env.VITE_MEW_WALLET_API || 'https://qa.mewwallet.dev'

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
  IS_DEV_MODE: import.meta.env.DEV,
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
  MEW_REWARDS_API_URL: 'https://mew-rewards-prod.ethvm.dev',
  STRAPI_CMS_URL: strapiUrl,
  STRAPI_CMS_API: `${strapiUrl}/api`,
  RWA_REWARDS_API: `${mewWalletUrl}/rwa-rewards/season2`,
  MEW_MOBILE_DOWNLOAD_URL: 'https://download.mewwallet.com',
  MEW_SENTRY_DSN:
    import.meta.env.VITE_SENTRY_DSN ||
    'https://3779ba7db0670350a396d35fbeb766c0@o382951.ingest.us.sentry.io/4511061868347392',
  VINATGE: 'https://www.myetherwallet.com/wallet/access',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.0.0',
  INTERCOM_APP_ID: import.meta.env.VITE_INTERCOM_ID || undefined,
  AMPLITUDE: import.meta.env.VITE_AMPLITUDE || 'dev',
  TRADING_RESTRICTION: import.meta.env.VITE_TRADING_RESTRICTION || 'off'
}

export default configs
