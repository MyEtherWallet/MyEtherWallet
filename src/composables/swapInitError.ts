/**
 * Whether a swap-init failure is transient/external — worth retrying and not
 * worth reporting to Sentry.
 *
 * The `@enkryptcom/swap` SDK fetches token lists from a remote (GitHub raw).
 * Transient upstream failures (e.g. a 400/HTML body the SDK then `JSON.parse`s,
 * or a dropped connection) surface as a `SyntaxError` or a network error. These
 * are expected external flakiness, not bugs.
 */
export function isTransientSwapInitError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message.toLowerCase() : ''
  // Only a JSON-parse SyntaxError counts as the transient upstream case (the
  // SDK JSON.parse'd a non-JSON body). Every JSON.parse error mentions "json"
  // across V8/Firefox/Safari, so this excludes unrelated SyntaxErrors that
  // would otherwise be retried and silently dropped from Sentry.
  if (e instanceof SyntaxError) return msg.includes('json')
  // WebKit's Response.json() on a non-JSON body throws a DOMException named
  // "SyntaxError" (code 12) with "The string did not match the expected
  // pattern" — same transient upstream case, but without "json" in the message.
  if (e instanceof DOMException) return e.name === 'SyntaxError'
  return (
    msg.includes('network') ||
    msg.includes('failed to fetch') ||
    msg.includes('fetch failed') ||
    msg.includes('timeout') ||
    msg.includes('load failed')
  )
}
