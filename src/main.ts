import '@assets/main.css'
import i18n from './i18n/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@assets/fonts/DMSans/DMSans.css'
import {
  init as sentryInit,
  browserTracingIntegration,
  replayIntegration,
  createSentryPiniaPlugin,
  vueIntegration,
} from '@sentry/vue'
import App from './App.vue'
import router from './router'
import { Provider } from './providers'
import { analytics, initAnalytics } from './analytics'
import { fetchTradingRestriction } from '@/composables/useTradingRestriction'
import rippleDirective from '@/directives/ripple'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import configs from '@/configs'
import {
  isBluetoothGattDisconnectedError,
  isExpectedTradeClientError,
  isExtensionOrProviderError,
  isForeignStackOverflow,
  isIndexedDbMutationError,
  isInvalidWalletAddressError,
  isLockedDeviceError,
  isMetaMaskSdkDecryptError,
  isProviderNotFoundError,
  isRainbowKitNotFoundError,
  isStorageQuotaExceededError,
  isTransactionReceiptTimeoutError,
  isTrezorHandshakeError,
} from '@/sentry/extensionNoise'
import { isTransientRpcError } from '@/modules/trade/composables/transientRpcError'

const app = createApp(App)

/**-------------------------
 * Sentry initialization
 -------------------------*/

const dsn = configs.MEW_SENTRY_DSN

if (dsn && process.env.NODE_ENV === 'production') {
  sentryInit({
    app,
    dsn,
    release: 'myetherwallet@' + configs.APP_VERSION,
    ignoreErrors: [
      'TypeError: Failed to fetch',
      'TypeError: NetworkError when attempting to fetch resource',
      'TypeError: Load failed',
      // Stale-deploy lazy-chunk errors: a cached index.html requests hashed
      // assets that no longer exist after a redeploy. These are already
      // auto-recovered by router.onError (reload once), so they are noise.
      'Unable to preload CSS',
      'Failed to fetch dynamically imported module',
      // WalletConnect benign rejections when the user abandons the connection flow
      'Proposal expired',
      'Pairing expired',
      'Request expired',
      // Transient WalletConnect relay hiccup: the @walletconnect/core Subscriber
      // fails to subscribe to a session topic over the relay WebSocket. The
      // connect flow already handles it (user gets a "Could not connect" toast
      // and can retry), so it is benign, unactionable network noise.
      /Subscribing to \w+ failed, please try again/,
    ],
    // Drop errors thrown inside browser extensions (catches events that DO
    // carry parsed extension frames). `webkit-masked-url` is how iOS 16.4+
    // WebKit exposes the source of extension / content-blocker / in-app-browser
    // injected scripts.
    denyUrls: [
      /(?:chrome|moz|safari-web)-extension:\/\//i,
      /webkit-masked-url:\/\//i,
    ],
    // Drop wallet-extension / EIP-1193 provider rejections (e.g. code 4900
    // "provider disconnected"), viem InvalidAddressError (a wallet returned a
    // malformed address on connect — already handled with a user toast), wagmi
    // ProviderNotFoundError (user tried to connect a browser wallet with no
    // injected provider — already handled with a user toast), and
    // transient RPC/WebSocket drops (e.g. a mewapi wss node closing mid-request,
    // surfacing as an unhandled "Connection is closed" rejection), viem
    // WaitForTransactionReceiptTimeoutError (a submitted trade tx that did not
    // confirm within the timeout — a network condition the app already handles),
    // and the external "not found rainbowkit" rejection emitted by a wallet's
    // injected in-app-browser detection script (not app code — our bundle never
    // throws it). Also a global backstop for trade quote/order errors already
    // flagged `expectedClientError` / `transientNetworkError` (1inch 4xx /
    // network hiccups) — the per-call-site catch in useTradeQuote /
    // useTradeExecution already skips its own captureException for these, but
    // they kept reaching Sentry anyway (APP-MEW-WEB-1F8 / MEW-2180), so this
    // drops them here too regardless of call site or build. These surface as
    // serialized plain objects or bare strings with no parsed frames, so
    // denyUrls can't catch them — inspect the original exception instead.
    // Genuine app errors are unaffected.
    beforeSend(event, hint) {
      const originalException = hint?.originalException
      if (
        isBluetoothGattDisconnectedError(originalException) ||
        isExpectedTradeClientError(originalException) ||
        isExtensionOrProviderError(originalException) ||
        isIndexedDbMutationError(originalException) ||
        isInvalidWalletAddressError(originalException) ||
        // Ledger "locked device" (0x5515) — hardware/user-state error, already
        // shown to the user as a toast; unactionable noise (APP-MEW-WEB-BH).
        isLockedDeviceError(originalException) ||
        isMetaMaskSdkDecryptError(originalException) ||
        isProviderNotFoundError(originalException) ||
        isRainbowKitNotFoundError(originalException) ||
        isStorageQuotaExceededError(originalException) ||
        isTransactionReceiptTimeoutError(originalException) ||
        isTransientRpcError(originalException) ||
        isTrezorHandshakeError(originalException) ||
        // iOS injected-script "Maximum call stack" RangeErrors with no app
        // frame — external, unactionable noise (APP-MEW-WEB-BB / MEW-2065).
        isForeignStackOverflow(event)
      )
        return null
      return event
    },
    integrations: [
      browserTracingIntegration({ router }),
      replayIntegration({
        block: ['[data-private]'],
      }),
      vueIntegration({
        tracingOptions: {
          trackComponents: true,
        },
      }),
    ],
    // Tracing
    tracesSampleRate: 0.2, //  Capture 20% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      'localhost',
      /^https?:\/\/app\.myetherwallet\.com(?:\/|$)/,
      /^https?:\/\/www\.app\.myetherwallet\.com(?:\/|$)/,
      /^https?:\/\/www\.app\.beta\.myetherwallet\.com(?:\/|$)/,
      /^https?:\/\/app\.beta\.myetherwallet\.com(?:\/|$)/,
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.

    enableLogs: true,
  })
}

/**-------------------------
 * PINIA
 -------------------------*/
const pinia = createPinia()
pinia.use(
  createSentryPiniaPlugin({
    // Strip the live wallet instance from the walletStore state before it is
    // attached to Sentry events. The wallet holds provider/account internals
    // (and potentially sensitive material) that must never leave the client.
    stateTransformer: state => {
      const walletStore = state.walletStore as
        | Record<string, unknown>
        | undefined
      if (walletStore && 'wallet' in walletStore) {
        return {
          ...state,
          walletStore: {
            ...walletStore,
            wallet: '[Filtered]',
          },
          purchase: null,
          chainsStore: {
            ...(state.chainsStore as Record<string, unknown> | undefined),
            allChains: null, // too large to send
            chains: null, // too large to send
          },
        }
      }
      return state
    },
  }),
)

app.use(pinia)
app.use(router)
app.use(i18n as any)
app.directive('ripple', rippleDirective)
app.use(autoAnimatePlugin)

// Initialize analytics only after the router's initial navigation has resolved,
// so the first auto-captured Page Viewed event includes the active route.
// (Right after app.use(router) the current route is still START_LOCATION.)
//
// The region check runs once here, on initial landing, so the
// `isRegionRestricted` user property is reported no matter which page the user
// entered on — not just the pages that consume the restriction themselves. It is
// chained after init so the identify call is not buffered pre-initialization,
// and it is a no-op for latency: the singleton dedupes with the earlier calls
// from TheHeader and the perps route guard, whichever fires first.
void router.isReady().then(async () => {
  await initAnalytics()
  void fetchTradingRestriction()
})

// Provide analytics for legacy inject() usage in Vue components
app.provide(Provider.ANALYTICS, analytics)

app.mount('#app')
