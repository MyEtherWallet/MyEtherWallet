/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  // add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
