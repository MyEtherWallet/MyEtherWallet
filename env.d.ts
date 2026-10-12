/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_APP_VERSION: string
  /** Optional build-target override ('production' | 'test' | 'dev'); see `BUILD_MODE` in src/configs.ts. */
  readonly VITE_BUILD_MODE?: string
  // add other variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
