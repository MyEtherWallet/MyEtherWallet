const configs = {
  WALLET_CONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
    '72299ce67c7d5c879dd8da2df1a6875b',
  MEW_API_URL: import.meta.env.VITE_MEW_API || 'https://mew-api-dev.ethvm.dev',
  MEW_PURCHASE_BASE_URL: 'https://qa.mewwallet.dev',
  MEW_PURCHASE_API: 'https://qa.mewwallet.dev/v5/purchase/info',
  MEW_EMAIL: 'https://mainnet.mewwallet.dev/email-web',
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
  MEW_REWARDS_API_URL:
    import.meta.env.VITE_MEW_REWARDS_API ||
    'https://mew-rewards-prod.ethvm.dev',
  MEW_LIVE_URLS: ['app.beta.myetherwallet.com', 'app.myetherwallet.com'],
  MEW_SENTRY_DSN:
    import.meta.env.VITE_SENTRY_DSN ||
    'https://3779ba7db0670350a396d35fbeb766c0@o382951.ingest.us.sentry.io/4511061868347392',
  VINATGE: 'https://www.myetherwallet.com/wallet/access',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.0.0',
  INTERCOM_APP_ID: import.meta.env.VITE_INTERCOM_ID || undefined,
}

export default configs
