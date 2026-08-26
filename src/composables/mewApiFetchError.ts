/**
 * Helpers for reporting MEW API fetch failures to Sentry.
 *
 * `@vueuse/core`'s `useFetch` throws `new Error(response.statusText)` on a
 * non-OK response. Over HTTP/2+ `statusText` is always an empty string, so the
 * thrown Error carries an empty message. Capturing that error directly made
 * every MEW API failure collapse into a single, unactionable
 * "Error: No error message" issue in Sentry.
 *
 * These pure helpers build a descriptive, never-empty message plus the grouping
 * / diagnostic context so captured failures are diagnosable and group by API
 * route / status instead of by an empty message.
 */

export interface MewApiFetchErrorContext {
  /** The Error thrown by useFetch — `new Error(response.statusText)` on non-OK. */
  error: unknown
  /** The parsed JSON response body, which may carry a `message`. */
  data?: unknown
  /** HTTP status code; `undefined` for network failures (no response). */
  status?: number
  /** HTTP status text — always empty over HTTP/2+. */
  statusText?: string
  /** The request URL, for diagnosis. */
  url?: string
}

export interface MewApiCapturedError {
  /** The Error to hand to `captureException`. */
  error: Error
  /** Bounded Sentry fingerprint so failures group by status / network. */
  fingerprint: string[]
  tags: Record<string, string>
  extra: Record<string, unknown>
}

const extractBodyMessage = (data: unknown): string | undefined => {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message.trim()
    }
  }
  return undefined
}

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message.trim()
  }
  if (typeof error === 'string') {
    return error.trim()
  }
  return ''
}

/**
 * Drop the query string from a URL so it is safe to use as a low-cardinality
 * Sentry tag (avoids leaking query params such as addresses).
 */
const sanitizeUrl = (url?: string): string => {
  if (!url) return 'unknown'
  const queryIndex = url.indexOf('?')
  return queryIndex === -1 ? url : url.slice(0, queryIndex)
}

/**
 * Build a descriptive, never-empty error message from the best available
 * signal: API body message → original error message → statusText → HTTP status
 * → network error.
 */
export const buildMewApiErrorMessage = (
  ctx: MewApiFetchErrorContext,
): string => {
  const bodyMessage = extractBodyMessage(ctx.data)
  if (bodyMessage) return bodyMessage

  const originalMessage = extractErrorMessage(ctx.error)
  if (originalMessage) return originalMessage

  const statusText = ctx.statusText?.trim()
  if (statusText) return statusText

  if (typeof ctx.status === 'number') {
    return `MEW API request failed with status ${ctx.status}`
  }

  return 'MEW API request failed (network error)'
}

/**
 * Bounded Sentry fingerprint: one bucket per HTTP status, one for network
 * failures — so distinct failure modes split apart without exploding into
 * per-URL cardinality.
 */
export const buildMewApiErrorFingerprint = (status?: number): string[] => [
  'mew-api-fetch-error',
  typeof status === 'number' ? String(status) : 'network',
]

/**
 * Turn a fetch-error context into everything needed to report a diagnosable,
 * properly grouped exception to Sentry. Reuses the original error (preserving
 * its type + stack, e.g. `TypeError: Failed to fetch`) when it already has a
 * message; otherwise wraps the built message in a fresh Error.
 */
export const describeMewApiFetchError = (
  ctx: MewApiFetchErrorContext,
): MewApiCapturedError => {
  const message = buildMewApiErrorMessage(ctx)
  const hasUsableError =
    ctx.error instanceof Error && ctx.error.message.length > 0
  const error = hasUsableError ? (ctx.error as Error) : new Error(message)
  // When we synthesize a fresh Error for the message, keep the original as its
  // `cause` so Sentry can still reconstruct the original stack. (The `cause`
  // constructor option isn't in this project's TS lib, so attach it after
  // construction.)
  if (!hasUsableError && ctx.error != null) {
    const withCause = error as { cause?: unknown }
    withCause.cause = ctx.error
  }

  return {
    error,
    fingerprint: buildMewApiErrorFingerprint(ctx.status),
    tags: {
      mew_api_url: sanitizeUrl(ctx.url),
      mew_api_status:
        typeof ctx.status === 'number' ? String(ctx.status) : 'network_error',
    },
    extra: {
      url: ctx.url,
      status: ctx.status,
      statusText: ctx.statusText,
      bodyMessage: extractBodyMessage(ctx.data),
    },
  }
}
