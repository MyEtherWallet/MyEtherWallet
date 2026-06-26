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
import rippleDirective from '@/directives/ripple'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import configs from '@/configs'

const app = createApp(App)

/**-------------------------
 * Sentry initialization
 -------------------------*/

const dsn = configs.MEW_SENTRY_DSN

if (dsn) {
  sentryInit({
    app,
    dsn,
    release: 'myetherwallet@' + configs.APP_VERSION,
    ignoreErrors: [
      'TypeError: Failed to fetch',
      'TypeError: NetworkError when attempting to fetch resource',
      'TypeError: Load failed',
    ],
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
            ...state.chainsStore as | Record<string, unknown> | undefined,
            allChains: null, // too large to send
            chains: null // too large to send

          }
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
void router.isReady().then(() => initAnalytics())

// Provide analytics for legacy inject() usage in Vue components
app.provide(Provider.ANALYTICS, analytics)

app.mount('#app')
