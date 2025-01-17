import '@assets/main.css'
import i18n from './i18n/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@assets/fonts/DMSans/DMSans.css'
import {
  init as sentryInit,
  browserTracingIntegration,
  replayIntegration,
  captureException,
} from '@sentry/vue'
import App from './App.vue'
import router from './router'
import { Types, createInstance } from '@amplitude/analytics-browser'
import { StoreConfigs } from './stores/configs'
import { Provider } from './providers'
import type { PopupState } from './stores/popup'
import { Analytics } from './analytics/amplitude'
import rippleDirective from '@/directives/ripple';

const app = createApp(App)

const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
  sentryInit({
    app,
    dsn,
    integrations: [browserTracingIntegration({ router }), replayIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [
      'localhost',
      /^https?:\/\/myetherwallet\.com/,
      /^https?:\/\/www\.myetherwallet\.com/,
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

// In v6 this is ens_namehash(version)
// TODO: figure out an appropriate value for it, ens namehash package
// would need to be added for the previous version
const __TMP_VERSION__ = 'v7'
const __TMP_HASHED_VERSION__ = `tmp_local_mew_web_${__TMP_VERSION__}`

let consentToTrack: boolean = false
const initialPopupStateJson = localStorage.getItem(
  StoreConfigs.LOCAL_STORAGE_KEYS.popups,
)
if (initialPopupStateJson) {
  try {
    const initialPopupState = JSON.parse(initialPopupStateJson) as PopupState
    switch (typeof initialPopupState?.consentToTrack) {
      case 'boolean':
        // Returning user
        consentToTrack = initialPopupState?.consentToTrack
        break
      case 'undefined':
        // New user (or local storage wiped)
        break
      default:
        // Invalid / unexpected value
        console.error(
          `Invalid consentToTrack value in popups store: ${String(initialPopupState?.consentToTrack)}`,
        )
        break
    }
  } catch (err) {
    console.error('Error parsing popups store from localStorage', err)
    captureException(err)
  }
}

const amplitude = createInstance()

// Initialise Amplitude
amplitude.init(__TMP_HASHED_VERSION__, {
  // TODO: should instanceName, apiKey, and serverUrl be environment variables?
  instanceName:
    process.env.NODE_ENV === 'production' ? 'mew-web-prod' : 'mew-web-dev',
  optOut: consentToTrack,
  serverUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://analytics-web.mewwallet.dev/record'
      : 'https://analytics-web-development.mewwallet.dev/record',
  appVersion: __TMP_VERSION__,
  trackingOptions: {
    ipAddress: false,
  },
  identityStorage: 'none',
  logLevel: Types.LogLevel.None,
  defaultTracking: {
    formInteractions: false,
    pageViews: false,
  },
})

app.use(createPinia())
app.use(router)
app.use(i18n)
app.directive('ripple', rippleDirective);
/**
 * Usage:
 *
 * ```ts
 * import { inject } from 'vue'
 * import { Provider } from '../providers'
 * import type { Analytics } from '../analytics/amplitude'
 * import { SomeEventType } from '../analytics/events'
 * const analytics = inject<Analytics>(Provider.ANALYTICS)
 *
 * // Event handler function, fired when some event occurs
 * function onSomethingHappened() {
 *   analytics.trackSomeEvent(SomeEventType.Something, { payload: 'stuff' })
 * }
 *
 * // ...
 * ```
 */
app.provide(Provider.ANALYTICS, new Analytics({ amplitude }))

app.mount('#app')
