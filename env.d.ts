/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_APP_VERSION: string
  /** Build target ('production' | 'dev', default 'dev'); see `BUILD_MODE` in src/configs.ts. */
  readonly VITE_BUILD_MODE?: string
  // add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
