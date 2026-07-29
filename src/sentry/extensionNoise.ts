// Benign EIP-1193 provider error codes. These originate from the user's wallet
// (injected extension provider), not from app code, and are pure Sentry noise:
//  4001  user rejected the request
//  4900  provider disconnected from all chains
//  4901  provider disconnected from the requested chain
// -32002 a matching request is already pending
const BENIGN_PROVIDER_CODES = new Set<number>([4001, 4900, 4901, -32002])

const EXTENSION_URL = /(?:chrome|moz|safari-web)-extension:\/\//i

/**
 * Whether an error is a wallet-extension / EIP-1193 provider rejection that
 * should be dropped before reaching Sentry. Matches either a benign provider
 * error code or a stack that points at a browser-extension URL. Used by the
 * Sentry `beforeSend` hook — note the production payload is a serialized plain
 * object (no parsed frames), so `denyUrls` alone cannot catch it.
 */
export function isExtensionOrProviderError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { code?: unknown; stack?: unknown }
  if (typeof e.code === 'number' && BENIGN_PROVIDER_CODES.has(e.code)) {
    return true
  }
  return typeof e.stack === 'string' && EXTENSION_URL.test(e.stack)
}

/**
 * Whether an error is a viem `InvalidAddressError` — thrown when a connected
 * wallet returns a malformed account address from `eth_requestAccounts`
 * (observed from buggy in-app wallet browsers). The connect flow already
 * handles it (the user sees a "Could not connect" toast), so it is external,
 * unactionable Sentry noise. Detected via the viem-guaranteed error `name`
 * rather than the message so it survives minification.
 */
export function isInvalidWalletAddressError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  return (err as { name?: unknown }).name === 'InvalidAddressError'
}

/**
 * Whether an error is a viem `WaitForTransactionReceiptTimeoutError` — thrown
 * when `waitForTransactionReceipt` times out because a submitted trade/swap tx
 * did not confirm within the timeout window (slow node, congestion, dropped tx,
 * or a flaky mobile connection). This is an inherent blockchain/network
 * condition, not an app bug — the tx may still confirm later and the app
 * already handles it (`handled: yes`), so it is unactionable Sentry noise.
 * Detected via the viem-guaranteed error `name` (survives minification),
 * walking the `cause` chain since viem may nest it.
 */
export function isTransactionReceiptTimeoutError(err: unknown): boolean {
  let cur: unknown = err
  for (let depth = 0; cur && typeof cur === 'object' && depth < 6; depth++) {
    const e = cur as { name?: unknown; cause?: unknown }
    if (e.name === 'WaitForTransactionReceiptTimeoutError') return true
    cur = e.cause
  }
  return false
}
