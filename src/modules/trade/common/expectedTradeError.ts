import type { AxiosError } from 'axios'
import { isUserRejectionError } from '@/utils/walletUtils'

/**
 * Statuses that look like a 4xx but are not the user's doing, so they must stay
 * reportable: a revoked or misconfigured 1inch credential (401), the provider
 * blocking us or the region (403), and rate limiting (429). Suppressing these
 * hides a fully broken trade path — the user sees a toast and Sentry sees
 * nothing.
 */
const REPORTABLE_CLIENT_STATUSES = new Set([401, 403, 429])

/**
 * Whether a trade-submit error is an *expected* client-side failure — it should
 * be surfaced to the user (toast) but skipped in Sentry, because it is pure
 * noise rather than an actionable bug:
 *   - the user rejected the wallet signature (EIP-1193 code 4001 / "rejected"),
 *   - 1inch returned a user-correctable 4xx (expired quote, illiquid pair,
 *     invalid order).
 *
 * Genuine failures stay unflagged and remain reportable: 5xx server errors,
 * the credential/authorization/throttle statuses above, network errors with no
 * response, and native-transaction reverts.
 */
export function isExpectedTradeError(e: unknown): boolean {
  if (isUserRejectionError(e)) return true
  const status = (e as AxiosError)?.response?.status
  if (typeof status !== 'number') return false
  if (REPORTABLE_CLIENT_STATUSES.has(status)) return false
  return status >= 400 && status < 500
}

/**
 * Reads the `expectedClientError` flag that the 1inch provider attaches to the
 * errors it throws. Guarded: a thrown `null`/`undefined`/primitive must not turn
 * a caught error into a `TypeError` inside the catch block, which would skip the
 * toast and analytics that follow.
 */
export function isExpectedClientError(e: unknown): boolean {
  if (typeof e !== 'object' || e === null) return false
  return !!(e as { expectedClientError?: boolean }).expectedClientError
}

/**
 * Reads the `transientNetworkError` flag the 1inch provider attaches when the
 * request never completed (axios "Network Error"). Guarded for the same reason
 * as `isExpectedClientError`.
 */
export function isTransientNetworkError(e: unknown): boolean {
  if (typeof e !== 'object' || e === null) return false
  return !!(e as { transientNetworkError?: boolean }).transientNetworkError
}
