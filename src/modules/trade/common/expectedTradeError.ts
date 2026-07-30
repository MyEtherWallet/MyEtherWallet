import type { AxiosError } from 'axios'
import { isUserRejectionError } from '@/utils/walletUtils'

/**
 * Whether a trade-submit error is an *expected* client-side failure — it should
 * be surfaced to the user (toast) but skipped in Sentry, because it is pure
 * noise rather than an actionable bug:
 *   - the user rejected the wallet signature (EIP-1193 code 4001 / "rejected"),
 *   - 1inch returned a 4xx (expired quote, illiquid pair, invalid order).
 *
 * Genuine failures stay unflagged and remain reportable: 5xx server errors,
 * network errors with no response, and native-transaction reverts.
 */
export function isExpectedTradeError(e: unknown): boolean {
  if (isUserRejectionError(e)) return true
  const status = (e as AxiosError)?.response?.status
  return typeof status === 'number' && status >= 400 && status < 500
}
