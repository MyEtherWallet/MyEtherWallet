const configs = {
  WALLET_CONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
    '72299ce67c7d5c879dd8da2df1a6875b',
  MEW_API_URL: import.meta.env.VITE_MEW_API || 'http://localhost:8080',
}

export default configs
