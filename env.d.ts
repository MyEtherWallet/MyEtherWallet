/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_APP_VERSION: string
  readonly VITE_SOCIAL_LOGIN_ENABLED?: string
  readonly VITE_PRIVY_APP_ID?: string
  readonly VITE_PRIVY_CLIENT_ID?: string
  // add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
