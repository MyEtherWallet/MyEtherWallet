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
 * Whether an error is the MetaMask SDK's AES-GCM socket-decryption failure
 * (`Error: aes/gcm: invalid ghash tag`). It is an unhandled promise rejection
 * thrown entirely inside the bundled MetaMask SDK's socket layer when it
 * receives a message it can't decrypt with its current key material (a stale /
 * expired MetaMask-mobile pairing session). No MEW code is in the stack and no
 * user is affected — pure Sentry noise. Matched on the (unminified) thrown
 * message AND a `metamask-sdk` stack frame so genuine app crypto errors are
 * left untouched.
 */
export function isMetaMaskSdkDecryptError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { message?: unknown; stack?: unknown }
  return (
    typeof e.message === 'string' &&
    e.message.includes('invalid ghash tag') &&
    typeof e.stack === 'string' &&
    e.stack.includes('metamask-sdk')
  )
}
