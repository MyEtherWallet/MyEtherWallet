import { describe, it, expect, vi, beforeAll } from 'vitest'

const sessionReplay = vi.hoisted(() => ({ init: vi.fn() }))
vi.mock('@amplitude/session-replay-browser', () => sessionReplay)
vi.mock('@amplitude/analytics-browser', () => ({
  Types: { LogLevel: { None: 0 } },
  createInstance: () => ({
    add: vi.fn(),
    init: vi.fn(),
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
vi.mock('@/analytics/amplitude', () => ({ Analytics: class {} }))
// Re-exported by the module under test; it reaches the hardware-wallet SDK.
vi.mock('@/analytics/user', () => ({}))
vi.mock('@/utils/isEU', () => ({ default: () => Promise.resolve(false) }))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))

interface PrivacyConfig {
  blockSelector?: string[]
  maskSelector?: string[]
  unmaskSelector?: string[]
}
let privacy: PrivacyConfig

/** An element the app has marked private, with text nested inside it. */
const markedPrivate = () => {
  const marked = document.createElement('div')
  marked.setAttribute('data-private', '')
  const inner = marked.appendChild(document.createElement('span'))
  return { marked, inner }
}

describe('session replay privacy settings', () => {
  beforeAll(async () => {
    const { initAnalytics } = await import('@/analytics')
    await initAnalytics()
    privacy = sessionReplay.init.mock.calls[0][1].privacyConfig
  })

  // Masking keeps the length of every word and leaves attributes readable.
  // Blocking records a placeholder box and nothing else.
  it('leaves everything marked data-private out of recordings altogether', () => {
    const { marked } = markedPrivate()

    expect(privacy.blockSelector?.some(s => marked.matches(s))).toBe(true)
  })

  // The recorder keeps ONE rule per selector string once it has fetched its
  // settings, and "mask" replaces "block". Listing the same selector under
  // both would quietly turn the blocking off.
  it('never lists the same selector as both blocked and masked', () => {
    const blocked = privacy.blockSelector ?? []

    expect(
      (privacy.maskSelector ?? []).filter(s => blocked.includes(s)),
    ).toEqual([])
    expect(
      (privacy.unmaskSelector ?? []).filter(s => blocked.includes(s)),
    ).toEqual([])
  })

  it('still masks marked text should the block rule ever be overridden', () => {
    const { marked, inner } = markedPrivate()
    const masks = (el: Element) =>
      (privacy.maskSelector ?? []).some(s => el.closest(s) !== null)

    expect(masks(marked)).toBe(true)
    expect(masks(inner)).toBe(true)
  })
})
