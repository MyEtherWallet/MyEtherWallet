/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_APP_VERSION: string
  // add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
