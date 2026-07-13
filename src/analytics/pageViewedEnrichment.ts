import type { Types } from '@amplitude/analytics-browser'
import router from '@/router'

/**
 * The event type Amplitude uses for its auto-captured page view event.
 * Kept in sync with `DEFAULT_PAGE_VIEW_EVENT` in @amplitude/analytics-browser.
 */
const PAGE_VIEWED_EVENT = '[Amplitude] Page Viewed'

/**
 * Enrichment plugin that augments the auto-captured `[Amplitude] Page Viewed`
 * event with the current vue-router route name, so reports key off stable
 * route names instead of raw URLs/paths.
 */
export const pageViewedEnrichmentPlugin = (): Types.EnrichmentPlugin => ({
  name: 'page-viewed-route-enrichment',
  type: 'enrichment',
  execute: async (event: Types.Event) => {
    if (event.event_type !== PAGE_VIEWED_EVENT) {
      return event
    }

    const route = router.currentRoute.value
    if (route.name) {
      event.event_properties = {
        ...event.event_properties,
        '[Amplitude] Route': String(route.name),
        '[Amplitude] Route Path': route.path,
      }

      if (typeof route.name === 'string' && route.name.includes('stock-info')) {
        event.event_properties['[Amplitude] Symbol'] = route.params.symbol
      }
    }

    return event
  },
})
