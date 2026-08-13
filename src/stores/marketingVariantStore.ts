import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { safeLocalStorage } from '@/utils/safeStorage'
import configs from '@/configs'
import { analytics, MarketingAbTestEvent } from '@/analytics'
import type {
  MarketingEntry,
  MarketingResponse,
  MarketingVariant,
} from '@/types/marketing'

// `populate=image` is required — Strapi omits relations from the default
// response, so without it every entry comes back with no image.
const ENDPOINT = `${configs.STRAPI_CMS_API}/MEW-marketing?populate=image`

const VARIANT_KEY = 'mew-marketing-ab-variant'
const DISMISSED_KEY = 'mew-marketing-ab-dismissed'

/**
 * Marketing content is decoration: a CMS outage, a schema change or a blocked
 * request must never surface an error or break the wallet, so every failure
 * path resolves to "no entries" and the tooltip simply never appears.
 */
const fetchEntries = (): Promise<MarketingEntry[]> => {
  return fetch(ENDPOINT)
    .then(res => {
      if (!res.ok) return []
      return res.json().then((body: MarketingResponse) => body?.data ?? [])
    })
    .catch(() => [])
}

/**
 * Entries marketing has actually scheduled to run right now. `startAt`/`endAt`
 * are null when that end is unbounded.
 */
const isLive = (entry: MarketingEntry, now: number): boolean => {
  if (!entry.isActive) return false
  if (entry.startAt) {
    const start = new Date(entry.startAt).getTime()
    if (!Number.isNaN(start) && now < start) return false
  }
  if (entry.endAt) {
    const end = new Date(entry.endAt).getTime()
    if (!Number.isNaN(end) && now >= end) return false
  }
  return true
}

export const useMarketingVariantStore = defineStore('marketingVariant', () => {
  const entries = ref<MarketingEntry[]>([])
  const hasLoaded = ref(false)

  // The assigned arm, sticky across sessions. Empty means not yet bucketed.
  // `safeLocalStorage` rather than a bare `useLocalStorage`: this writes on
  // first exposure, which is exactly the case that throws in sandboxed iframes
  // and Android WebView. In the in-memory fallback the arm re-rolls each load —
  // unavoidable for those users, and preferable to a bootstrap crash.
  const variant = useStorage<MarketingVariant | ''>(
    VARIANT_KEY,
    '',
    safeLocalStorage,
  )
  const dismissed = useStorage<boolean>(DISMISSED_KEY, false, safeLocalStorage)

  // Deliberately NOT persisted: this is what makes the tooltip return next
  // session while `dismissed` is what ends it for good.
  const shownThisSession = ref(false)

  const load = async () => {
    if (hasLoaded.value) return
    entries.value = await fetchEntries()
    hasLoaded.value = true
  }

  /** Live entries, in the order Strapi returned them. */
  const liveEntries = computed(() => {
    const now = Date.now()
    return entries.value.filter(entry => isLive(entry, now))
  })

  /**
   * A is the first live entry, B is the last.
   *
   * Positional by design (for now) — the CMS has no explicit variant field. A
   * single live entry makes both arms resolve to it, which is the right
   * degenerate behaviour: everyone sees the one thing marketing published.
   */
  const variantEntries = computed<Record<MarketingVariant, MarketingEntry> | null>(
    () => {
      const live = liveEntries.value
      if (live.length === 0) return null
      return { A: live[0], B: live[live.length - 1] }
    },
  )

  /**
   * Bucket the user, once. Called at the moment of exposure rather than at
   * store setup: bucketing someone who never sees the tooltip would dilute the
   * experiment with users who were never in it.
   */
  const assignVariant = (): MarketingVariant => {
    if (variant.value === 'A' || variant.value === 'B') return variant.value
    const assigned: MarketingVariant = Math.random() < 0.5 ? 'A' : 'B'
    variant.value = assigned
    return assigned
  }

  /** The entry this user should see, or null when there is nothing to show. */
  const activeEntry = computed<MarketingEntry | null>(() => {
    const byVariant = variantEntries.value
    if (!byVariant) return null
    // Read-only: an unassigned user resolves against A for preview purposes but
    // is not bucketed until `markShown` runs.
    const arm = variant.value === 'B' ? 'B' : 'A'
    return byVariant[arm]
  })

  const canShow = computed(
    () => !dismissed.value && !shownThisSession.value && !!variantEntries.value,
  )

  /**
   * Analytics must never be able to suppress the UI.
   *
   * `_track` catches its own failures, but the `setX` user-property methods
   * call `amplitude.identify()` unguarded. That throws when the SDK is not
   * initialised yet (init is deferred to `router.isReady()`) or when a private
   * window's tracking protection blocks it — conditions that hold in a
   * production build but not against the local `dev` key. Unguarded, the throw
   * propagated out of `markShown` after `shownThisSession` was already set,
   * so the tooltip stayed hidden for the whole session with no retry.
   */
  const report = (send: () => void) => {
    try {
      send()
    } catch {
      // Reporting is best-effort; never let it break the render path.
    }
  }

  const payloadFor = (arm: MarketingVariant, entry: MarketingEntry) => ({
    variant: arm,
    documentId: entry.documentId,
    title: entry.title,
    tokenId: entry.tokenId,
  })

  /**
   * Commit the exposure: bucket the user, report it, and hold the tooltip back
   * for the rest of this session.
   *
   * Returns the arm as well as the entry — the two arms render differently, so
   * the caller needs both from the same commit rather than re-reading `variant`
   * afterwards.
   */
  const markShown = (): {
    variant: MarketingVariant
    entry: MarketingEntry
  } | null => {
    const byVariant = variantEntries.value
    if (!byVariant || shownThisSession.value) return null
    const arm = assignVariant()
    const entry = byVariant[arm]
    shownThisSession.value = true
    report(() => {
      analytics.setMarketingVariant(arm)
      analytics.trackMarketingAbTestEvent(
        MarketingAbTestEvent.SHOWN,
        payloadFor(arm, entry),
      )
    })
    return { variant: arm, entry }
  }

  const trackDismiss = () => {
    const byVariant = variantEntries.value
    const arm = variant.value === 'B' ? 'B' : 'A'
    if (byVariant) {
      report(() =>
        analytics.trackMarketingAbTestEvent(
          MarketingAbTestEvent.DISMISSED,
          payloadFor(arm, byVariant[arm]),
        ),
      )
    }
    dismissed.value = true
  }

  const trackCtaClick = () => {
    const byVariant = variantEntries.value
    const arm = variant.value === 'B' ? 'B' : 'A'
    if (byVariant) {
      // Guarded for the same reason as the exposure: the caller opens the trade
      // panel straight after this, and a throw here would swallow the click.
      report(() =>
        analytics.trackMarketingAbTestEvent(
          MarketingAbTestEvent.CLICKED_CTA,
          payloadFor(arm, byVariant[arm]),
        ),
      )
    }
    // Acting on the offer ends the campaign for this user just as ✕ does.
    dismissed.value = true
  }

  /** Hide for this session without ending the campaign. */
  const hideForSession = () => {
    shownThisSession.value = true
  }

  return {
    entries,
    hasLoaded,
    variant,
    dismissed,
    shownThisSession,
    liveEntries,
    variantEntries,
    activeEntry,
    canShow,
    load,
    assignVariant,
    markShown,
    trackDismiss,
    trackCtaClick,
    hideForSession,
  }
})
