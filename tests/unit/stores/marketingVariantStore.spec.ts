import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import type { MarketingEntry } from '@/types/marketing'

// The store reports exposures on assignment; the real module loads Amplitude
// and the hw-wallet chain, neither of which resolves under jsdom.
const trackMarketingAbTestEvent = vi.fn()
const setMarketingVariant = vi.fn()
vi.mock('@/analytics', () => ({
  analytics: {
    trackMarketingAbTestEvent: (...args: unknown[]) =>
      trackMarketingAbTestEvent(...args),
    setMarketingVariant: (...args: unknown[]) => setMarketingVariant(...args),
  },
  MarketingAbTestEvent: {
    SHOWN: 'Marketing_AB_Tooltip_Shown',
    DISMISSED: 'Marketing_AB_Tooltip_Dismissed',
    CLICKED_CTA: 'Marketing_AB_Tooltip_Clicked_CTA',
  },
}))

const { useMarketingVariantStore } =
  await import('@/stores/marketingVariantStore')

const VARIANT_KEY = 'mew-marketing-ab-variant'
const DISMISSED_KEY = 'mew-marketing-ab-dismissed'
const DISMISSED_AT_KEY = 'mew-marketing-ab-dismissed-at'

const entry = (over: Partial<MarketingEntry> = {}): MarketingEntry => ({
  id: 1,
  documentId: 'doc-1',
  title: 'A Version Test',
  description: 'lorem ipsum',
  ctaText: null,
  tokenId: 'nflxon',
  isActive: true,
  startAt: null,
  endAt: null,
  createdAt: '2026-08-13T21:45:21.449Z',
  updatedAt: '2026-08-13T21:45:21.449Z',
  publishedAt: '2026-08-13T21:45:21.461Z',
  ...over,
})

const image = (name: string): MarketingEntry['image'] => ({
  id: 634,
  documentId: `img-${name}`,
  name: `${name}.png`,
  alternativeText: null,
  width: 512,
  height: 512,
  mime: 'image/png',
  url: `/uploads/${name}.png`,
  formats: null,
})

const A = entry({
  id: 2,
  documentId: 'doc-a',
  title: 'A Version Test',
  image: image('Netflix'),
})
const B = entry({
  id: 4,
  documentId: 'doc-b',
  title: 'B Test Version',
  tokenId: 'HDon',
  image: image('HD'),
})

const stubFetch = (rows: MarketingEntry[], ok = true) =>
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      json: async () => ({ data: rows }),
    }),
  )

/** Roll a specific arm: < 0.5 assigns A, >= 0.5 assigns B. */
const rollA = () => vi.spyOn(Math, 'random').mockReturnValue(0.1)
const rollB = () => vi.spyOn(Math, 'random').mockReturnValue(0.9)

describe('marketingVariantStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    trackMarketingAbTestEvent.mockClear()
    setMarketingVariant.mockClear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe('variant resolution — A is first, B is last', () => {
    it('maps the first row to A and the last to B', async () => {
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.variantEntries?.A.documentId).toBe('doc-a')
      expect(store.variantEntries?.B.documentId).toBe('doc-b')
    })

    // More than two rows is not the intended setup, but first/last must still
    // be well defined rather than silently picking a middle row.
    it('ignores rows between the first and the last', async () => {
      const middle = entry({ id: 3, documentId: 'doc-mid' })
      stubFetch([A, middle, B])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.variantEntries?.A.documentId).toBe('doc-a')
      expect(store.variantEntries?.B.documentId).toBe('doc-b')
    })

    it('resolves both arms to the same row when only one is live', async () => {
      stubFetch([A])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.variantEntries?.A.documentId).toBe('doc-a')
      expect(store.variantEntries?.B.documentId).toBe('doc-a')
    })
  })

  describe('scheduling — buckets are taken from live rows only', () => {
    it('excludes inactive rows', async () => {
      stubFetch([entry({ documentId: 'off', isActive: false }), A, B])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.liveEntries).toHaveLength(2)
      expect(store.variantEntries?.A.documentId).toBe('doc-a')
    })

    it('excludes rows whose window has not opened or has closed', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(
        new Date('2026-08-13T12:00:00Z').getTime(),
      )
      stubFetch([
        entry({ documentId: 'future', startAt: '2026-09-01T00:00:00Z' }),
        A,
        B,
        entry({ documentId: 'past', endAt: '2026-08-01T00:00:00Z' }),
      ])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.liveEntries.map(e => e.documentId)).toEqual([
        'doc-a',
        'doc-b',
      ])
    })

    it('keeps a row whose window is currently open', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(
        new Date('2026-08-13T12:00:00Z').getTime(),
      )
      stubFetch([
        entry({
          documentId: 'live',
          startAt: '2026-08-01T00:00:00Z',
          endAt: '2026-09-01T00:00:00Z',
        }),
      ])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.liveEntries).toHaveLength(1)
    })

    it('shows nothing when no row is live', async () => {
      stubFetch([entry({ isActive: false })])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.variantEntries).toBeNull()
      expect(store.canShow).toBe(false)
      expect(store.markShown()).toBeNull()
    })
  })

  describe('assignment', () => {
    it('buckets into A or B by the roll', async () => {
      stubFetch([A, B])
      rollB()
      const store = useMarketingVariantStore()
      await store.load()

      const shown = store.markShown()
      expect(shown?.entry.documentId).toBe('doc-b')
      // The arm comes back with the entry: the two arms render differently, so
      // the caller must not have to re-read `variant` to know which it got.
      expect(shown?.variant).toBe('B')
      expect(store.variant).toBe('B')
    })

    it('reports arm A for a low roll', async () => {
      stubFetch([A, B])
      rollA()
      const store = useMarketingVariantStore()
      await store.load()

      const shown = store.markShown()
      expect(shown?.variant).toBe('A')
      expect(shown?.entry.documentId).toBe('doc-a')
    })

    // The whole point of the feature: a returning user must not be re-rolled.
    it('honours a bucket stored in an earlier session', async () => {
      // Raw, unquoted: a string default makes `useStorage` pick the string
      // serializer, so the stored form is the bare letter.
      localStorage.setItem(VARIANT_KEY, 'B')
      // A roll that would otherwise produce A — it must not be consulted.
      rollA()
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.markShown()?.entry.documentId).toBe('doc-b')
      expect(store.variant).toBe('B')
      expect(Math.random).not.toHaveBeenCalled()
    })

    it('does not bucket a user who is never exposed', async () => {
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()

      // `useStorage` seeds the key with its default, so absence of a bucket is
      // the empty string rather than a missing key.
      expect(store.variant).toBe('')
      expect(localStorage.getItem(VARIANT_KEY)).not.toMatch(/^[AB]$/)
    })

    it('reports the exposure once, with the arm and the entry', async () => {
      stubFetch([A, B])
      rollA()
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()

      expect(setMarketingVariant).toHaveBeenCalledWith('A')
      expect(trackMarketingAbTestEvent).toHaveBeenCalledTimes(1)
      expect(trackMarketingAbTestEvent).toHaveBeenCalledWith(
        'Marketing_AB_Tooltip_Shown',
        {
          variant: 'A',
          documentId: 'doc-a',
          title: 'A Version Test',
          tokenId: 'nflxon',
        },
      )

      // Second call in the same session is a no-op.
      expect(store.markShown()).toBeNull()
      expect(trackMarketingAbTestEvent).toHaveBeenCalledTimes(1)
    })
  })

  // Amplitude's `setX` methods call `identify()` unguarded, which throws when
  // the SDK is not initialised yet or a private window blocks it — true in a
  // production build, not against the local `dev` key. A throw must never
  // reach the caller: it would abort the render after `shownThisSession` was
  // set, hiding the tooltip for the session with no retry.
  describe('analytics failures cannot suppress the tooltip', () => {
    it('still returns the exposure when the user property throws', async () => {
      setMarketingVariant.mockImplementationOnce(() => {
        throw new Error('amplitude not initialised')
      })
      stubFetch([A, B])
      rollA()
      const store = useMarketingVariantStore()
      await store.load()

      const shown = store.markShown()
      expect(shown?.entry.documentId).toBe('doc-a')
      expect(shown?.variant).toBe('A')
    })

    it('still returns the exposure when the event throws', async () => {
      trackMarketingAbTestEvent.mockImplementationOnce(() => {
        throw new Error('blocked by tracking protection')
      })
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.markShown()).not.toBeNull()
    })

    // The CTA handler opens the trade panel right after this call.
    it('still dismisses when the CTA event throws', async () => {
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()
      trackMarketingAbTestEvent.mockImplementationOnce(() => {
        throw new Error('blocked')
      })

      expect(() => store.trackCtaClick()).not.toThrow()
      expect(store.dismissed).toBe(true)
    })
  })

  describe('dismissal', () => {
    it('ends the campaign on explicit dismiss', async () => {
      stubFetch([A, B])
      rollB()
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()
      store.trackDismiss()

      expect(store.dismissed).toBe(true)
      expect(store.canShow).toBe(false)
      expect(trackMarketingAbTestEvent).toHaveBeenCalledWith(
        'Marketing_AB_Tooltip_Dismissed',
        expect.objectContaining({ variant: 'B', documentId: 'doc-b' }),
      )
    })

    it('ends the campaign when the CTA is taken', async () => {
      stubFetch([A, B])
      rollA()
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()
      store.trackCtaClick()

      expect(store.dismissed).toBe(true)
      // The arm must ride along on the CTA event — without it the click can't
      // be attributed to a bucket and the test measures nothing.
      expect(trackMarketingAbTestEvent).toHaveBeenCalledWith(
        'Marketing_AB_Tooltip_Clicked_CTA',
        {
          variant: 'A',
          documentId: 'doc-a',
          title: 'A Version Test',
          tokenId: 'nflxon',
        },
      )
    })

    // The B arm is where an attribution bug would hide: the arm is re-derived
    // from the persisted bucket here rather than passed in from `markShown`.
    it('attributes a CTA click to the B arm and its entry', async () => {
      stubFetch([A, B])
      rollB()
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()
      store.trackCtaClick()

      expect(trackMarketingAbTestEvent).toHaveBeenCalledWith(
        'Marketing_AB_Tooltip_Clicked_CTA',
        {
          variant: 'B',
          documentId: 'doc-b',
          title: 'B Test Version',
          tokenId: 'HDon',
        },
      )
    })

    it('stays hidden for a user who dismissed in an earlier session', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.canShow).toBe(false)
    })

    // "Every session until dismissed": hiding for the session must not persist.
    it('hideForSession does not end the campaign', async () => {
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()
      store.hideForSession()

      expect(store.canShow).toBe(false)
      expect(store.dismissed).toBe(false)
      expect(localStorage.getItem(DISMISSED_KEY)).not.toBe('true')
    })
  })

  // A dismissal answers the campaign that was running at the time, not the
  // feature forever: when marketing schedules new material with a later
  // `startAt`, the ✕ is cleared and the tooltip is forced back on.
  describe('a newer campaign undoes an earlier dismissal', () => {
    const NOW = new Date('2026-08-13T12:00:00Z').getTime()
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(NOW)
    })

    it('clears the flag when a live entry started after the dismissal', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      localStorage.setItem(DISMISSED_AT_KEY, '2026-08-01T00:00:00.000Z')
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.dismissed).toBe(false)
      expect(store.canShow).toBe(true)
    })

    it('keeps the flag for the very campaign that was dismissed', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      localStorage.setItem(DISMISSED_AT_KEY, '2026-08-10T00:00:00.000Z')
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.dismissed).toBe(true)
      expect(store.canShow).toBe(false)
    })

    // Only `startAt` announces new material. An entry without one is
    // indistinguishable from the one the user already said no to.
    it('keeps the flag when no live entry is scheduled', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      localStorage.setItem(DISMISSED_AT_KEY, '2026-08-01T00:00:00.000Z')
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.dismissed).toBe(true)
    })

    it('takes the newest start among several live entries', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      localStorage.setItem(DISMISSED_AT_KEY, '2026-08-05T00:00:00.000Z')
      stubFetch([
        entry({ documentId: 'old', startAt: '2026-08-01T00:00:00Z' }),
        entry({ documentId: 'new', startAt: '2026-08-12T00:00:00Z' }),
      ])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.latestStart).toBe(new Date('2026-08-12T00:00:00Z').getTime())
      expect(store.dismissed).toBe(false)
    })

    // A future `startAt` is not live yet, so it must not clear the flag early —
    // the reset lands on the first load once the campaign has actually opened.
    it('waits for a scheduled campaign to open before clearing', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      localStorage.setItem(DISMISSED_AT_KEY, '2026-08-01T00:00:00.000Z')
      stubFetch([entry({ startAt: '2026-09-01T00:00:00Z' })])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.dismissed).toBe(true)
    })

    it('records the campaign start when the user dismisses', async () => {
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()
      store.trackDismiss()
      // `useStorage` writes on flush, not on assignment.
      await nextTick()

      expect(localStorage.getItem(DISMISSED_AT_KEY)).toBe(
        '2026-08-10T00:00:00.000Z',
      )
    })

    // Nothing scheduled means nothing to anchor to, so the clock stands in:
    // the user answered what was live at this moment, and only something
    // starting later counts as new.
    it('falls back to the clock for an unscheduled campaign', async () => {
      stubFetch([A, B])
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()
      store.trackDismiss()
      await nextTick()

      expect(localStorage.getItem(DISMISSED_AT_KEY)).toBe(
        new Date(NOW).toISOString(),
      )
    })

    it('records the campaign on a CTA click too', async () => {
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const store = useMarketingVariantStore()
      await store.load()
      store.markShown()
      store.trackCtaClick()
      await nextTick()

      expect(localStorage.getItem(DISMISSED_AT_KEY)).toBe(
        '2026-08-10T00:00:00.000Z',
      )
    })

    // Users who dismissed before this marker shipped have no anchor, so their
    // ✕ cannot be shown to have answered anything. Setting a `startAt` on the
    // live entry is how marketing brings all of them back.
    it('resurrects a dismissal that predates the marker', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.dismissed).toBe(false)
      expect(store.canShow).toBe(true)
    })

    // ...but only once. The next ✕ anchors them, and the same campaign must
    // not come back on every load after that.
    it('anchors a resurrected user on their next dismissal', async () => {
      localStorage.setItem(DISMISSED_KEY, 'true')
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const first = useMarketingVariantStore()
      await first.load()
      first.markShown()
      first.trackDismiss()
      await nextTick()

      setActivePinia(createPinia())
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const next = useMarketingVariantStore()
      await next.load()

      expect(next.dismissed).toBe(true)
      expect(next.canShow).toBe(false)
    })

    it('leaves the marker alone for a user who never dismissed', async () => {
      stubFetch([entry({ startAt: '2026-08-10T00:00:00Z' })])
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.dismissed).toBe(false)
      expect(localStorage.getItem(DISMISSED_AT_KEY)).not.toMatch(/\d/)
    })

    // The end-to-end path marketing cares about: say no today, get the next
    // announcement anyway.
    it('shows the tooltip again in a later session for new material', async () => {
      stubFetch([
        entry({ documentId: 'first', startAt: '2026-08-01T00:00:00Z' }),
      ])
      const first = useMarketingVariantStore()
      await first.load()
      first.markShown()
      first.trackDismiss()
      expect(first.canShow).toBe(false)

      // New session: fresh store, same persisted flags, newer campaign.
      setActivePinia(createPinia())
      stubFetch([
        entry({ documentId: 'second', startAt: '2026-08-12T00:00:00Z' }),
      ])
      const next = useMarketingVariantStore()
      await next.load()

      expect(next.dismissed).toBe(false)
      expect(next.canShow).toBe(true)
      expect(next.markShown()?.entry.documentId).toBe('second')
    })
  })

  describe('fetch failures are silent', () => {
    it('treats a non-ok response as no content', async () => {
      stubFetch([A, B], false)
      const store = useMarketingVariantStore()
      await store.load()

      expect(store.variantEntries).toBeNull()
      expect(store.canShow).toBe(false)
    })

    it('treats a network error as no content', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
      const store = useMarketingVariantStore()
      await expect(store.load()).resolves.toBeUndefined()

      expect(store.variantEntries).toBeNull()
    })

    // Strapi omits relations unless asked, so dropping `populate` would leave
    // every entry image-less while still returning 200.
    it('requests the MEW-marketing collection with the image populated', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      })
      vi.stubGlobal('fetch', fetchMock)
      const store = useMarketingVariantStore()
      await store.load()

      const url = String(fetchMock.mock.calls[0][0])
      expect(url).toContain('/MEW-marketing')
      expect(url).toContain('populate=image')
    })
  })
})
