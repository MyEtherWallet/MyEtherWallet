import { Types, createInstance } from '@amplitude/analytics-browser'
import { Analytics } from './amplitude'
import { StoreConfigs } from '@/stores/configs'
import type { PopupState } from '@/stores/popup'
import { captureException } from '@sentry/vue'

const __TMP_VERSION__ = 'v7'
const __TMP_HASHED_VERSION__ = `tmp_local_mew_web_${__TMP_VERSION__}`

// Check initial consent state from localStorage
let consentToTrack: boolean = false
const initialPopupStateJson = localStorage.getItem(
  StoreConfigs.LOCAL_STORAGE_KEYS.popups,
)
if (initialPopupStateJson) {
  try {
    const initialPopupState = JSON.parse(initialPopupStateJson) as PopupState
    if (typeof initialPopupState?.consentToTrack === 'boolean') {
      consentToTrack = initialPopupState.consentToTrack
    }
  } catch (err) {
    console.error('Error parsing popups store from localStorage', err)
    captureException(err)
  }
}

// Create and initialize Amplitude instance
const amplitude = createInstance()

amplitude.init(__TMP_HASHED_VERSION__, {
  instanceName:
    process.env.NODE_ENV === 'production' ? 'mew-web-prod' : 'mew-web-dev',
  optOut: !consentToTrack,
  serverUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://analytics-web-v7.mewwallet.dev/record'
      : 'https://analytics-web-development-v7.mewwallet.dev/record',
  appVersion: __TMP_VERSION__,
  trackingOptions: {
    ipAddress: false,
  },
  identityStorage: 'none',
  logLevel: Types.LogLevel.None,
  defaultTracking: {
    formInteractions: false,
  },
})

/**
 * Analytics singleton instance
 *
 * Usage:
 * ```ts
 * import { analytics } from '@/analytics'
 *
 * analytics.trackSwapEvent(SwapEvent.SUCCESS, { fromToken: 'ETH' })
 * analytics.setNetwork('Ethereum')
 * ```
 */
export const analytics = new Analytics({ amplitude })

// Re-export types and events for convenience
export * from './events'
export * from './user'
export { Analytics } from './amplitude'
