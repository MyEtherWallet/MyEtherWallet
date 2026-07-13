import isEU from '@/utils/isEU';
import { Types, createInstance, } from '@amplitude/analytics-browser'
import { Analytics } from './amplitude'
import { StoreConfigs } from '@/stores/configs'
import type { AnalyticsState } from '@/stores/analyticsStore'
import { captureException } from '@sentry/vue'
import * as sessionReplay from '@amplitude/session-replay-browser'
import { pageUrlEnrichmentPlugin } from "@amplitude/plugin-page-url-enrichment-browser";
import { pageViewedEnrichmentPlugin } from './pageViewedEnrichment';
import configs from '@/configs';

const __TMP_VERSION__ = configs.APP_VERSION
const __TMP_HASHED_VERSION__ = `tmp_local_mew_web_${__TMP_VERSION__}`

// Amplitude instance is created eagerly (no side effects, no router dependency),
// but initialization is deferred to initAnalytics() so it runs after the router
// is set up. Initializing here would otherwise fire during the router import via
// the router -> walletStore -> analytics dependency chain.
const amplitude = createInstance()

/**
 * Reads the persisted consent state from localStorage.
 */
const getConsentToTrack = (): boolean => {
  const initialPopupStateJson = localStorage.getItem(
    StoreConfigs.LOCAL_STORAGE_KEYS.analytics,
  )
  if (!initialPopupStateJson) {
    return false
  }
  try {
    const initialAnalyticsState = JSON.parse(
      initialPopupStateJson,
    ) as AnalyticsState
    if (
      typeof initialAnalyticsState?.consentToTrack === 'boolean' &&
      initialAnalyticsState?.hasSetConsent === true
    ) {
      return initialAnalyticsState.consentToTrack
    }
  } catch (err) {
    console.error('Error parsing analytics store from localStorage', err)
    captureException(err)
  }
  return false
}

let initialized = false

/**
 * Initializes Amplitude and Session Replay.
 *
 * Must be called AFTER the router is created (e.g. after `app.use(router)` in
 * main.ts) so that the page-view enrichment plugin can read the active route.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export const initAnalytics = async (): Promise<void> => {
  if (initialized) {
    return
  }

  const consentToTrack = getConsentToTrack()

  const serverUrl = process.env.NODE_ENV === 'production'
    ? 'https://analytics-web-v7.mewwallet.dev/record'
    : 'https://analytics-web-development-v7.mewwallet.dev/record'

  amplitude.add(pageUrlEnrichmentPlugin())
  amplitude.add(pageViewedEnrichmentPlugin())
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
    sampleRate: .8,
    privacyConfig: {
      maskSelector: ['[data-private]'],
      defaultMaskLevel: 'light',
    },
  })

  // Latch only after every fallible step succeeds, so a failure leaves the
  // flag unset and a later call can retry initialization.
  initialized = true
}

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
