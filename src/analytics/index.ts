import isEU from '@/utils/isEU';
import { Types, createInstance } from '@amplitude/analytics-browser'
import { Analytics } from './amplitude'
import { StoreConfigs } from '@/stores/configs'
import type { AnalyticsState } from '@/stores/analyticsStore'
import { captureException } from '@sentry/vue'
import * as sessionReplay from '@amplitude/session-replay-browser'

const __TMP_VERSION__ = 'v7'
const __TMP_HASHED_VERSION__ = `tmp_local_mew_web_${__TMP_VERSION__}`

// Check initial consent state from localStorage
let consentToTrack: boolean = false
const initialPopupStateJson = localStorage.getItem(
  StoreConfigs.LOCAL_STORAGE_KEYS.analytics,
)
if (initialPopupStateJson) {
  try {
    const initialAnalyticsState = JSON.parse(
      initialPopupStateJson,
    ) as AnalyticsState
    if (
      typeof initialAnalyticsState?.consentToTrack === 'boolean' &&
      initialAnalyticsState?.hasSetConsent === true
    ) {
      consentToTrack = initialAnalyticsState.consentToTrack
    }
  } catch (err) {
    console.error('Error parsing analytics store from localStorage', err)
    captureException(err)
  }
}

// Create and initialize Amplitude instance
const amplitude = createInstance()

const serverUrl = process.env.NODE_ENV === 'production'
  ? 'https://analytics-web-v7.mewwallet.dev/record'
  : 'https://analytics-web-development-v7.mewwallet.dev/record'

amplitude.init(__TMP_HASHED_VERSION__, {
  instanceName:
    process.env.NODE_ENV === 'production' ? 'mew-web-prod' : 'mew-web-dev',
  optOut: !consentToTrack,
  serverUrl: serverUrl,
  appVersion: __TMP_VERSION__,
  identityStorage: 'none',
  logLevel: Types.LogLevel.None,
  defaultTracking: {
    formInteractions: false,
  },
})

const inEU = await isEU();
const prodConfigUrl = inEU ? 'https://analytics-web-v7.mewwallet.dev/config-eu' : 'https://analytics-web-v7.mewwallet.dev/config'
const devConfigUrl = inEU ? 'https://analytics-web-development-v7.mewwallet.dev/config-eu' : 'https://analytics-web-development-v7.mewwallet.dev/config'
const prodSessionReplayUrl = inEU ? 'https://analytics-web-v7.mewwallet.dev/session-replay-eu' : 'https://analytics-web-v7.mewwallet.dev/session-replay'
const devSessionReplayUrl = inEU ? 'https://analytics-web-development-v7.mewwallet.dev/session-replay-eu' : 'https://analytics-web-development-v7.mewwallet.dev/session-replay'

const sessionId = amplitude.getSessionId()
const deviceId = amplitude.getDeviceId()

sessionReplay.init(__TMP_HASHED_VERSION__, {
  configServerUrl: process.env.NODE_ENV === 'production' ? prodConfigUrl : devConfigUrl,
  trackServerUrl: process.env.NODE_ENV === 'production' ? prodSessionReplayUrl : devSessionReplayUrl,
  optOut: !consentToTrack,
  sessionId: sessionId,
  deviceId: deviceId,
  serverZone: inEU ? 'EU' : 'US',
  debugMode: process.env.NODE_ENV !== 'production',
  sampleRate: 5
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
