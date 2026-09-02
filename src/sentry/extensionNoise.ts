import configs from '@/configs'

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
 * Whether an error is a Chrome "Extension context invalidated." rejection —
 * thrown by an injected wallet provider (e.g. Rabby) when the extension's
 * background context is torn down mid-session (the extension was updated,
 * reloaded, or disabled while the dApp page stayed open). A pending request
 * (e.g. `eth_requestAccounts` during connect) then rejects with a raw JSON-RPC
 * object `{ code: -32603, message: "Extension context invalidated." }`. It is
 * not app code and MEW can't fix it — the user just reloads so the fresh
 * extension re-injects — and the connect flow already surfaces a "Failed to
 * connect" error state, so it is unactionable Sentry noise (APP-MEW-WEB-1JD).
 * Matched on the (Chrome-provided, un-minified) message, which the serialized
 * plain-object payload carries at top level; the generic -32603 code alone is
 * too broad to key on.
 */
export function isExtensionContextInvalidatedError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const message = (err as { message?: unknown }).message
  return (
    typeof message === 'string' &&
    message.toLowerCase().includes('extension context invalidated')
  )
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
 * Whether an error is a trade quote/order failure already flagged as an
 * expected 1inch 4xx client error or a transient axios network hiccup.
 * `OneInchFusion.getQuote` / `submitOrder` (oneInchFusion.ts) set
 * `expectedClientError` / `transientNetworkError` on the thrown error
 * specifically so the per-call-site catch (`useTradeQuote`,
 * `useTradeExecution`) can skip its own `captureException` — but that is a
 * single, per-call-site check. This is a global backstop at the Sentry
 * ingestion boundary: if either flag reaches `beforeSend` uncaught by that
 * local check (APP-MEW-WEB-1F8 kept recurring across releases despite the
 * flag being set), drop it here too instead of letting it through as noise.
 */
export function isExpectedTradeClientError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as {
    expectedClientError?: unknown
    transientNetworkError?: unknown
  }
  return e.expectedClientError === true || e.transientNetworkError === true
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

/**
 * Whether an error is a `@ledgerhq` `LockedDeviceError` — thrown by the Ledger
 * transport (WebUSB / WebBLE) when the connected device is locked, i.e. the
 * user hasn't entered their PIN or the device screensaver kicked in (APDU
 * status `0x5515`). This is a hardware/user-state condition, not an app bug:
 * the access/connect flow already catches it (`handled: yes`) and shows a
 * friendly localized toast (`common.error.ledger_locked`), and the fix is
 * entirely in the user's hands (unlock the device). So it is unactionable
 * Sentry noise (APP-MEW-WEB-BH). Detected primarily via the `@ledgerhq`
 * error `name` (set as a string literal, so it survives minification), with a
 * message fallback for the `0x5515` / "locked device" shape in case the error
 * was rethrown as a plain `Error`.
 */
export function isLockedDeviceError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { name?: unknown; message?: unknown }
  if (e.name === 'LockedDeviceError') return true
  const message = typeof e.message === 'string' ? e.message.toLowerCase() : ''
  return message.includes('0x5515') || message.includes('locked device')
}

/**
 * Whether an error is mew-api's "CoinGecko coin not found" 400 — returned
 * when a user navigates directly to (or shares) a `/token/<symbol>` URL for a
 * symbol CoinGecko doesn't list (typo, delisted, or never-listed token).
 * `TokenInfoChart.vue`'s `onFetchError` already handles it by rendering
 * "No data available", so it is expected, unactionable Sentry noise, not an
 * app bug (APP-MEW-WEB-1F3 / MEW-2172). `useFetchMewApi`'s shared
 * `onFetchError` surfaces the mew-api response body message verbatim as the
 * Error message (see `describeMewApiFetchError`), so match on that exact
 * prefix rather than the HTTP status — other mew-api 400s on other endpoints
 * are unrelated and should keep reporting.
 */
export function isCoinNotFoundApiError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const message = (err as { message?: unknown }).message
  return (
    typeof message === 'string' && /^CoinGecko coin not found:/i.test(message)
  )
}

/**
 * Whether a Sentry event is the MEW purchase-info endpoint
 * (`configs.MEW_PURCHASE_API`, e.g. `/v5/purchase/info`) answering 403.
 *
 * The purchase backend returns 403 when fiat purchase is unavailable to the
 * caller's region/wallet (a business rule, not an app bug). `fetchPurchaseInfo`
 * (`src/stores/purchaseStore.ts`) already handles the failure silently — Buy/
 * Sell just render with no assets — so every occurrence reaching Sentry via the
 * shared `useFetchMewApi` error reporter is unactionable noise
 * (APP-MEW-WEB-1F5 / MEW-2173).
 *
 * Matched on the event's `mew_api_url` / `mew_api_status` tags (set by
 * `describeMewApiFetchError`), not the message, so it drops only this exact
 * endpoint + status pair — a 403 from any other MEW API route is still
 * reported.
 */
export function isBenignPurchaseInfoForbidden(event: unknown): boolean {
  if (!event || typeof event !== 'object') return false
  const tags = (event as { tags?: Record<string, unknown> }).tags
  if (!tags) return false
  return (
    tags.mew_api_url === configs.MEW_PURCHASE_API &&
    tags.mew_api_status === '403'
  )
}

/**
 * Whether an error is the WalletConnect relay "Connection interrupted while
 * trying to subscribe" rejection. Thrown entirely inside `@walletconnect/core`'s
 * Relayer when the relay WebSocket (`wss://relay.walletconnect.org`) disconnects
 * mid-(re)connect while it is subscribing to a session topic — an
 * `onunhandledrejection` that reaches the global Sentry `beforeSend` with no MEW
 * frame in the stack. The connect flow already handles it (the user can retry),
 * so it is transient, unactionable network noise (APP-MEW-WEB-61 / MEW-2240).
 * MEW code never throws this message, so matching on the library-specific
 * message is safe. Distinct from the sibling `/Subscribing to \w+ failed/` and
 * "connection is closed" shapes already suppressed elsewhere. Handles both the
 * Error-object and bare-string payload shapes.
 */
export function isWalletConnectSubscribeInterruptedError(
  err: unknown,
): boolean {
  const MESSAGE = 'Connection interrupted while trying to subscribe'
  if (typeof err === 'string') return err.includes(MESSAGE)
  if (!err || typeof err !== 'object') return false
  const message = (err as { message?: unknown }).message
  return typeof message === 'string' && message.includes(MESSAGE)
}

// The null-`info` deref message, in both shapes the crash surfaces as: the
// `he.info` read (`Cannot read properties of null (reading 'info')`) and the
// `({ info }) =>` destructure (`Cannot destructure property 'info' of ...`).
const NULL_INFO_MESSAGE =
  /cannot read properties of null \(reading 'info'\)|cannot destructure property 'info' of/i
// An EIP-6963 provider-discovery frame — retained (non-mangled) in the minified
// bundle: the bundled `mipd` store (`requestProviders`, `createStore`), wagmi's
// connector enumeration (`getProviders`), the `eip6963:announceProvider`
// listeners, and MEW's own `providerStore.addProvider`.
const EIP6963_DISCOVERY_FRAME =
  /requestProviders|createStore|getProviders|announceProvider|eip6963|addProvider/i

/**
 * Whether an error is the EIP-6963 `announceProvider` null-`detail` crash.
 *
 * A browser wallet extension announces itself by dispatching an
 * `eip6963:announceProvider` CustomEvent whose `detail` should be
 * `{ info, provider }`. A buggy or hostile extension can dispatch it with a
 * null (or null-`info`) `detail`. Three independent listeners then read `.info`
 * off it and throw: MEW's own `providerStore.addProvider` (the `App.vue`
 * listener), and — via `generateConfig` → wagmi `createConfig` — the bundled
 * `mipd` store's `requestProviders` callback and wagmi's `getProviders()`
 * enumeration (APP-MEW-WEB-1JG / 1JM / 1JN). None is an app logic bug: the
 * announced payload is untrusted third-party extension input, and MEW cannot
 * correct it at the mipd/wagmi layer without a dependency bump. So all three are
 * external, unactionable Sentry noise.
 *
 * Matched on the browser-native (minification-proof) null-`info` message AND an
 * EIP-6963 provider-discovery frame in the stack, so an unrelated `.info`
 * null-deref elsewhere in the app keeps reporting. Fails open when no stack is
 * present (never suppresses on the message alone).
 */
export function isEip6963NullProviderError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { message?: unknown; stack?: unknown }
  if (typeof e.message !== 'string' || !NULL_INFO_MESSAGE.test(e.message)) {
    return false
  }
  return typeof e.stack === 'string' && EIP6963_DISCOVERY_FRAME.test(e.stack)
}
