const configs = {
  WALLET_CONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
    '72299ce67c7d5c879dd8da2df1a6875b',
  MEW_API_URL: import.meta.env.VITE_MEW_API || 'https://mew-api-dev.ethvm.dev',
  MEW_EMAIL: 'https://mewwallet.dev/email-web',
}

export default configs
