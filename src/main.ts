import './assets/main.css'
import i18n from './i18n/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Types, createInstance } from '@amplitude/analytics-browser'
import { StoreConfigs } from './stores/configs'
import { Provider } from './providers'
import type { PopupState } from './stores/popup'
import { Analytics } from './analytics/amplitude'

const app = createApp(App)

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
    if (typeof initialPopupState?.consentToTrack === 'boolean') {
      consentToTrack = initialPopupState?.consentToTrack
    } else {
      console.error('Invalid consentToTrack value in popups store')
    }
  } catch (err) {
    console.error('Error parsing popups store from localStorage', err)
  }
}

const amplitude = createInstance()

// Initialise Amplitude
amplitude.init(__TMP_HASHED_VERSION__, {
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
app.use(router).use(i18n)

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
