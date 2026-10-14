// Locale-independent markers of expected swap-quote conditions: the aggregator
// couldn't produce a usable quote/gas estimate for the current input (thin
// liquidity, slippage / return below minimum, or not enough funds for gas).
// These are surfaced to the user via `generalError`; they are user/on-chain
// state, never an app defect, so they must NOT be reported to Sentry.
// Sentry APP-MEW-WEB-EV — `execution reverted (InsufficientReturnAmount())`.
const EXPECTED_QUOTE_ERROR_RE = /insufficient funds|execution reverted/i

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
