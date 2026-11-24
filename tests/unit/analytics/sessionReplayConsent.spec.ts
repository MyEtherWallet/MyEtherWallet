import { describe, it, expect, vi, beforeEach } from 'vitest'

const CONSENT_KEY = 'analytics-store'
const consented = JSON.stringify({ consentToTrack: true, hasSetConsent: true })
const optedOut = JSON.stringify({ consentToTrack: false, hasSetConsent: true })

const h = vi.hoisted(() => ({
  sessionReplay: { init: vi.fn(), shutdown: vi.fn() },
  storage: new Map<string, string>(),
  /** Runs while analytics start-up waits on the region check. */
  duringRegionCheck: () => {},
}))

vi.mock('@amplitude/session-replay-browser', () => h.sessionReplay)
vi.mock('@amplitude/analytics-browser', () => ({
  Types: { LogLevel: { None: 0 } },
  Identify: class {},
  createInstance: () => ({
    add: vi.fn(),
    init: vi.fn(),
    setOptOut: vi.fn(),
    getSessionId: () => 1,
    getDeviceId: () => 'device',
  }),
}))
vi.mock('@amplitude/plugin-page-url-enrichment-browser', () => ({
  pageUrlEnrichmentPlugin: () => ({}),
}))
vi.mock('@/analytics/pageViewedEnrichment', () => ({
  pageViewedEnrichmentPlugin: () => ({}),
}))
// Both reach the hardware-wallet SDKs.
vi.mock('@/analytics/user', () => ({}))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))
vi.mock('@/utils/safeStorage', () => ({
  safeLocalStorage: {
    getItem: (key: string) => h.storage.get(key) ?? null,
    setItem: (key: string, value: string) => void h.storage.set(key, value),
    removeItem: (key: string) => void h.storage.delete(key),
  },
}))
vi.mock('@/utils/isEU', () => ({
  default: () => {
    h.duringRegionCheck()
    return Promise.resolve(false)
  },
}))

/** The `optOut` the recorder was started with. */
const startedOptedOut = () => h.sessionReplay.init.mock.calls[0][1].optOut

describe('session replay follows the tracking choice', () => {
  beforeEach(() => {
    vi.resetModules()
    h.sessionReplay.init.mockClear()
    h.sessionReplay.shutdown.mockClear()
    h.storage.clear()
    h.duringRegionCheck = () => {}
  })

  // The recorder reads the choice once, when it starts. Before this it kept
  // recording a user who had just turned tracking off, until the next load.
  it('stops recording as soon as tracking is turned off', async () => {
    const { analytics } = await import('@/analytics')

    analytics.setTrackingConsent(false)

    expect(h.sessionReplay.shutdown).toHaveBeenCalledTimes(1)
  })

  it('leaves the recorder alone when tracking is turned on', async () => {
    const { analytics } = await import('@/analytics')

    analytics.setTrackingConsent(true)

    expect(h.sessionReplay.shutdown).not.toHaveBeenCalled()
  })

  it('starts recording for a user who consented', async () => {
    h.storage.set(CONSENT_KEY, consented)
    const { initAnalytics } = await import('@/analytics')

    await initAnalytics()

    expect(startedOptedOut()).toBe(false)
  })

  it('does not record a user who has not consented', async () => {
    h.storage.set(CONSENT_KEY, optedOut)
    const { initAnalytics } = await import('@/analytics')

    await initAnalytics()

    expect(startedOptedOut()).toBe(true)
  })

  // Start-up waits on a network call before it starts the recorder. A choice
  // made in that gap must not be overtaken by the one read before it.
  it('does not record a user who turned tracking off while analytics was starting', async () => {
    h.storage.set(CONSENT_KEY, consented)
    h.duringRegionCheck = () => h.storage.set(CONSENT_KEY, optedOut)
    const { initAnalytics } = await import('@/analytics')

    await initAnalytics()

    expect(startedOptedOut()).toBe(true)
  })

  // Turning tracking on mid-session never started the recorder before, and
  // still must not: only an opt-out is allowed to change the outcome.
  it('does not start recording for a choice made while analytics was starting', async () => {
    h.storage.set(CONSENT_KEY, optedOut)
    h.duringRegionCheck = () => h.storage.set(CONSENT_KEY, consented)
    const { initAnalytics } = await import('@/analytics')

    await initAnalytics()

    expect(startedOptedOut()).toBe(true)
  })
})
