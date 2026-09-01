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
 * Whether an error is the external "not found rainbowkit" rejection. It is
 * emitted by a wallet's injected in-app-browser detection script (observed on
 * mobile Safari / iOS in-app wallet browsers), never by app code or any bundled
 * dependency — our `@rainbow-me/rainbowkit` only ever throws "Connector not
 * found". It reaches the global Sentry `beforeSend` as an unhandled rejection
 * with no first-party frames, so it is pure external noise. Matched by message
 * on both the Error-object and bare-string payload shapes.
 */
export function isRainbowKitNotFoundError(err: unknown): boolean {
  if (typeof err === 'string') return err.includes('not found rainbowkit')
  if (!err || typeof err !== 'object') return false
  const message = (err as { message?: unknown }).message
  return typeof message === 'string' && message.includes('not found rainbowkit')
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

/**
 * Whether an error is a wagmi `ProviderNotFoundError` — thrown when a connector
 * calls `getProvider()` and no injected wallet is present (e.g. the user clicks
 * "Browser Wallet" with no extension installed). The connect flow already
 * handles it (the user sees a "Could not connect" toast), so it is expected,
 * unactionable Sentry noise. Detected via the wagmi-guaranteed error `name`
 * rather than the message so it survives minification.
 */
export function isProviderNotFoundError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  return (err as { name?: unknown }).name === 'ProviderNotFoundError'
}

/**
 * Whether an error is a Trezor Connect `handshake failed` — thrown when the
 * Trezor Connect popup/iframe can't complete its handshake with
 * connect.trezor.io (popup blocked, third-party cookies disabled, adblocker,
 * or a flaky network). The access address-load flow already handles it (the
 * user sees a "Something went wrong / handshake failed" toast), so it is
 * external, unactionable Sentry noise. Matched on the (Trezor-specific)
 * message rather than a code/name because the library throws a plain `Error`.
 */
export function isTrezorHandshakeError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const message = (err as { message?: unknown }).message
  return (
    typeof message === 'string' &&
    message.toLowerCase().includes('handshake failed')
  )
}

// A stack frame belongs to MEW app code if its source URL is one of ours.
// The host is anchored to `*.myetherwallet.com` / localhost so look-alike hosts
// (e.g. `notmyetherwallet.com`) don't match, and a bare `/assets/` is accepted
// only as a relative path so foreign bundles like
// `chrome-extension://…/assets/foo.js` are excluded. The hashed production
// bundles are served from `app.myetherwallet.com/assets/…`.
const APP_FRAME_URL =
  /^(?:https?:\/\/(?:(?:[a-z0-9-]+\.)*myetherwallet\.com|localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)|\/assets\/)/i

interface SentryFrameLike {
  filename?: unknown
}
interface SentryExceptionLike {
  value?: unknown
  stacktrace?: { frames?: unknown } | null
}
interface SentryEventLike {
  exception?: { values?: unknown } | null
}

/**
 * Whether a Sentry event is a "Maximum call stack size exceeded" `RangeError`
 * that did NOT originate in app code, and is therefore unactionable noise.
 *
 * On iOS Safari / WKWebView, scripts injected by content blockers, Safari
 * extensions, and in-app browsers (the "Google" in-app browser, etc.) throw
 * uncaught `RangeError`s that bubble to the page's `window.onerror` and get
 * reported as if they were ours. Since iOS 16.4 / WebKit masks the source URL
 * of such scripts (`webkit-masked-url://` or an empty URL), the event carries
 * only frames Sentry cannot attribute to a file (rendered as `undefined:LL:CC`).
 *
 * A genuine in-app recursion always leaves at least one frame whose URL is an
 * app origin, so the presence of any app frame keeps the event. This is
 * event-based (not `originalException`-based) because "no app frame" is only
 * reliable on the parsed event frames — the raw exception often has no stack.
 */
export function isForeignStackOverflow(event: unknown): boolean {
  if (!event || typeof event !== 'object') return false
  const values = (event as SentryEventLike).exception?.values
  if (!Array.isArray(values) || values.length === 0) return false

  const isStackOverflow = values.some(v => {
    const value = (v as SentryExceptionLike)?.value
    return (
      typeof value === 'string' &&
      /maximum call stack size exceeded/i.test(value)
    )
  })
  if (!isStackOverflow) return false

  // Keep the event if ANY frame points at app code — that is a real MEW bug.
  const hasAppFrame = values.some(v => {
    const frames = (v as SentryExceptionLike)?.stacktrace?.frames
    if (!Array.isArray(frames)) return false
    return frames.some(f => {
      const filename = (f as SentryFrameLike)?.filename
      return typeof filename === 'string' && APP_FRAME_URL.test(filename)
    })
  })
  return !hasAppFrame
}

/**
 * Whether an error is a storage `QuotaExceededError` (DOMException code 22).
 *
 * On the Home route (wallet not connected) the wallet-connection stack
 * (WalletConnect / wagmi core) persists session state to IndexedDB during
 * bootstrap. That write is fire-and-forget inside the library, so when the
 * browser's per-origin storage quota is exhausted (Firefox private mode, a
 * near-full disk, or strict privacy settings) the IndexedDB transaction
 * rejects with "The current transaction exceeded its quota limitations." and
 * bubbles to the global `onunhandledrejection` handler with no first-party
 * frames. Our own synchronous `localStorage` writes are already guarded by
 * `safeLocalStorage` (they degrade to an in-memory map on quota), so a quota
 * error reaching Sentry is always this external, unactionable async noise.
 * Matched via the DOMException `name` / legacy `code` (both quota-exclusive),
 * so it survives minification and the serialized plain-object payload shape.
 */
export function isStorageQuotaExceededError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { name?: unknown; code?: unknown }
  return e.name === 'QuotaExceededError' || e.code === 22
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

/**
 * Whether an error is an IndexedDB `InvalidStateError` (DOMException code 11 —
 * "A mutation operation was attempted on a database that did not allow
 * mutations"). This comes from `idb-keyval` write operations (`set`/`del` in a
 * `readwrite` transaction), which MEW never calls directly — it is only bundled
 * by the wallet SDKs (`@coinbase/wallet-sdk`, `@base-org/account`, `porto`,
 * WalletConnect `keyvaluestorage`). On boot those connectors fire-and-forget an
 * IndexedDB write to persist session state; on Firefox with private/restricted
 * storage the write fails and, being fire-and-forget, the rejection reaches the
 * global handler as unhandled, unactionable noise (0 users impacted —
 * APP-MEW-WEB-1GG / MEW-2176). Matched on the browser-native (non-minified)
 * DOMException message: `name`/`code` alone can't be used because every
 * `InvalidStateError` carries `code === 11`, so filtering on the code would
 * suppress unrelated `InvalidStateError`s from other Web APIs.
 */
export function isIndexedDbMutationError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { name?: unknown; message?: unknown }
  if (e.name !== 'InvalidStateError') return false
  return (
    typeof e.message === 'string' &&
    e.message.includes('did not allow mutations')
  )
}
/* Whether an error is a Web Bluetooth "GATT Server is disconnected"
  * DOMException.Chrome throws this(`NetworkError`, code 19) whenever a GATT
  * operation runs after the device has disconnected.The Ledger BLE transport
  * (`@ledgerhq/hw-transport-web-ble`) triggers it when its RxJS monitor teardown
  * fire - and - forgets`characteristic.stopNotifications()` after the device drops
  * mid - handshake(powered off / out of range / Bluetooth toggled).Since that
  * call is detached from any promise the app awaits, it surfaces as an unhandled
  * rejection, and the connect flow already shows the user a "Failed to connect"
  * toast — so it is external, unactionable Sentry noise.The frames are bundled
  * into our own`/assets/index-*.js`, so denyUrls can't catch it; matched on the
  * browser - native(minification - proof) message instead.
 */
export function isBluetoothGattDisconnectedError(err: unknown): boolean {
  if (typeof err === 'string') return /GATT Server is disconnected/i.test(err)
  if (!err || typeof err !== 'object') return false
  const message = (err as { message?: unknown }).message
  return (
    typeof message === 'string' && /GATT Server is disconnected/i.test(message)
  )
}
