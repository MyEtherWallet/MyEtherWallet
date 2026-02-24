const configs = {
  WALLET_CONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
    '72299ce67c7d5c879dd8da2df1a6875b',
  MEW_API_URL: import.meta.env.VITE_MEW_API || 'https://mew-api-dev.ethvm.dev',
  MEW_PURCHASE_API: 'https://mainnet.mewwallet.dev/v5/purchase/info',
  MEW_EMAIL: 'https://mainnet.mewwallet.dev/email-web',
  MEW_MPC_RPC_URL: 'http://localhost:8787',
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
  MEW_LIVE_URLS: ['app.beta.myetherwallet.com', 'app.myetherwallet.com'],
}

export default configs
