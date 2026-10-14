// Stale-deploy lazy-chunk failures. After a deploy, a client still running the
// old index.html asks the CDN for hashed JS/CSS filenames the new deploy has
// removed. The CDN answers with an HTML fallback page or a 404, so the
// dynamic import() (or its CSS preload) throws. The wording differs per
// browser engine, but the recovery is the same for all of them: reload once
// so the client picks up the fresh index.html and its current asset hashes.
//
//   Chromium   "Failed to fetch dynamically imported module"
//   Firefox    "error loading dynamically imported module"
//   WebKit     "Importing a module script failed" (Safari — APP-MEW-WEB-A5)
//   stale HTML "'text/html' is not a valid JavaScript MIME type" (APP-MEW-WEB-B8)
//   CSS        "Unable to preload CSS for ..." (APP-MEW-WEB-1K6)
//
// Two paths lead here. Route components fail inside the router, which knows
// the destination and lands the user there (router.onError). Imports inside
// libraries never reach the router: viem lazy-loads `@noble/curves/secp256k1`
// on its first signature recovery (`verifyMessage`, `recoverAddress`), so a
// stale client fetching `/assets/secp256k1-<old hash>.js` after a deploy got a
// 404 and the Verify Message page simply failed. Those are caught through the
// `vite:preloadError` event Vite's preload helper dispatches for every failed
// dynamic import (installStaleChunkReload).
//
// This list is the single source of truth: both recovery paths use it to
// decide when to reload, and main.ts spreads it into Sentry's ignoreErrors so
// the auto-recovered errors stop being reported.
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

const RELOAD_KEY_PREFIX = 'chunk-reload:'

// The first handler to see a chunk failure in this page load owns the decision.
// Module scope on purpose: it resets with the reload it guards, and it stops
// the router path and the global path from both acting on the same failure
// (or the global path retrying a failure the router already declined).
let decided = false

const hasReloaded = (key: string): boolean => {
  try {
    return sessionStorage.getItem(key) !== null
  } catch {
    return false
  }
}

const markReloaded = (key: string): boolean => {
  try {
    sessionStorage.setItem(key, '1')
    return true
  } catch {
    // Without storage the once-per-session guard cannot survive the reload, so
    // a permanently missing chunk would loop. Surface the error instead.
    return false
  }
}

/**
 * Reload once so the client picks up the fresh index.html.
 *
 * `path` keys the guard (one attempt per page per session) and `navigate`
 * performs the reload. Returns whether a reload was started.
 */
export function reloadOnceForStaleChunk(
  path: string,
  navigate: () => void,
): boolean {
  if (decided) return false
  decided = true
  // Offline, the same import() failure means the network is gone, not that
  // the deploy moved on. A reload would swap the app for the browser's
  // offline page; leave the error to the caller instead.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false
  }
  const key = RELOAD_KEY_PREFIX + path
  if (hasReloaded(key)) return false
  if (!markReloaded(key)) return false
  navigate()
  return true
}

/**
 * Catch stale-chunk failures that never reach the router.
 *
 * Vite dispatches `vite:preloadError` for every failed dynamic import() and
 * dependency preload, route components included. Route failures are left to
 * router.onError, which knows the destination: the macrotask delay lets that
 * handler go first, after which `decided` makes this one a no-op. Anything the
 * router did not claim by then (an import inside a library) reloads in place.
 *
 * Only fetch-shaped failures qualify. The same event fires when a chunk throws
 * while evaluating, and reloading would not fix a code bug.
 *
 * Returns the uninstall function.
 */
export function installStaleChunkReload(target: Window = window): () => void {
  const onPreloadError = (event: Event) => {
    const error = (event as Event & { payload?: unknown }).payload
    if (!isChunkLoadError(error)) return
    setTimeout(() => {
      const { pathname, search, hash } = target.location
      reloadOnceForStaleChunk(pathname + search + hash, () =>
        target.location.reload(),
      )
    }, 0)
  }
  target.addEventListener('vite:preloadError', onPreloadError)
  return () => target.removeEventListener('vite:preloadError', onPreloadError)
}

/** Test hook: the module-level once-guard would otherwise leak between specs. */
export function resetStaleChunkReloadForTests(): void {
  decided = false
}
