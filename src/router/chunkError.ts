// Stale-deploy lazy-chunk failures. After a deploy, a client still running the
// old index.html asks the CDN for hashed JS/CSS filenames the new deploy has
// removed. The CDN answers with an HTML fallback page or a 404, so the
// route-level dynamic import() (or its CSS preload) throws. The wording differs
// per browser engine, but the recovery is the same for all of them: reload once
// so the client picks up the fresh index.html and its current asset hashes.
//
//   Chromium   "Failed to fetch dynamically imported module"
//   Firefox    "error loading dynamically imported module"
//   WebKit     "Importing a module script failed" (Safari — APP-MEW-WEB-A5)
//   stale HTML "'text/html' is not a valid JavaScript MIME type" (APP-MEW-WEB-B8)
//   CSS        "Unable to preload CSS for ..." (APP-MEW-WEB-1K6)
//
// This list is the single source of truth: router.onError uses it to decide
// when to reload, and main.ts spreads it into Sentry's ignoreErrors so the
// auto-recovered errors stop being reported.
export const CHUNK_LOAD_ERROR_MESSAGES = [
  'Failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'Importing a module script failed',
  'is not a valid JavaScript MIME type',
  'Unable to preload CSS',
] as const

export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return CHUNK_LOAD_ERROR_MESSAGES.some(fragment => message.includes(fragment))
}
