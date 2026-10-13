import i18n from '@/i18n'

// Locale-independent markers of expected swap-quote conditions: the aggregator
// couldn't produce a usable quote/gas estimate for the current input (thin
// liquidity, slippage / return below minimum, or not enough funds for gas).
// These are surfaced to the user via `generalError`; they are user/on-chain
// state, never an app defect, so they must NOT be reported to Sentry.
// Sentry APP-MEW-WEB-EV — `execution reverted (InsufficientReturnAmount())`.
const EXPECTED_QUOTE_ERROR_RE = /insufficient funds|execution reverted/i

// Gas estimation on the backend fails when the wallet can't cover
// `gas * price + value`; the raw node error reads e.g.
// "Quote failed: failed with 16777216 gas: insufficient funds for gas * price
// + value: address 0x… have 731751886664816 want 30000000000000000".
const INSUFFICIENT_FUNDS_RE =
  /insufficient funds|gas required exceeds allowance/i
const EXECUTION_REVERTED_RE = /execution reverted/i
// The MEW API prefixes every failed gas-estimate / quote simulation with this.
const QUOTE_FAILED_PREFIX_RE = /^quote failed/i

/**
 * True when a caught swap gas-fee / quote error is an expected on-chain or
 * user-state condition that should be shown to the user but not sent to Sentry.
 *
 * Covers only locale-independent patterns; the self-thrown, translated
 * "pair not available" message is matched separately at the call site (it needs
 * the active locale via `t()`).
 */
export const isExpectedSwapQuoteError = (message?: string): boolean =>
  EXPECTED_QUOTE_ERROR_RE.test(message ?? '')

/**
 * Map a raw gas-fee / quote error message (as thrown by the MEW API or the
 * node) to a friendly, localized string for the swap form. The raw text
 * contains addresses and wei amounts and must never reach the user as-is.
 *
 * Returns `undefined` for unrecognized errors so callers can fall back to the
 * raw message (or their own translated default).
 */
export const getLocalizedSwapQuoteError = (
  raw: string | undefined,
  nativeSymbol: string | undefined,
): string | undefined => {
  if (!raw) return undefined
  const { t } = i18n.global
  if (INSUFFICIENT_FUNDS_RE.test(raw)) {
    return t('swap.error.insufficient-balance-for-fees', {
      symbol: nativeSymbol ?? '',
    })
  }
  if (EXECUTION_REVERTED_RE.test(raw)) {
    return t('swap.error.pair-not-available')
  }
  if (QUOTE_FAILED_PREFIX_RE.test(raw)) {
    return t('swap.error.quote-failed')
  }
  return undefined
}
