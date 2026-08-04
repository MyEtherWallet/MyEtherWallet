import { computed, getCurrentScope, onScopeDispose, ref } from 'vue'
import { captureException } from '@sentry/vue'
import Configs from '@/configs'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'
import { perpsClient } from '../configs'
import { PerpsHttpError } from '../sdk/client'

const isDevMode = Configs.IS_DEV_MODE

/**
 * `/status` is unauthenticated and returns a single field, so polling it is
 * cheap. A minute is enough resolution for a passive banner, and it doubles as
 * the retry that clears the banner once the service recovers.
 */
const POLL_INTERVAL_MS = 60_000

/**
 * Server-error floor. Only a 5xx counts as an outage worth telling the user
 * about; the endpoint documents 200, 429 and 500, and of those only the 500 is
 * the service being down.
 *
 * A 429 is the opposite of an outage — the service answered, it just wants us to
 * poll less — so it must not raise the banner. Anything else the endpoint might
 * return (4xx, or a request that never got a response at all) is likewise not
 * evidence the service is down.
 */
const SERVER_ERROR_STATUS = 500

// Singleton state: every surface reads the same status, so the page banner and
// any future consumer can never disagree about service availability.
//
// The last HTTP status observed from `/status`, or `null` before the first
// response — and also when a request never reached one (offline, DNS, CORS,
// aborted), which is indistinguishable from "unknown" for our purposes and
// deliberately does not raise the banner.
const statusCode = ref<number | null>(null)
const isLoadingStatus = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null
let consumers = 0

/**
 * Pings `/status` and returns the HTTP status it answered with (`null` if it
 * never answered).
 *
 * Only the response code is consulted — the `marketStatus` field in the body is
 * not read, since availability is what the banner reports.
 */
export async function fetchPerpsStatus(): Promise<number | null> {
  isLoadingStatus.value = true
  try {
    await perpsClient.getStatus()
    statusCode.value = 200
  } catch (e) {
    statusCode.value = e instanceof PerpsHttpError ? e.status : null
    if (isDevMode) {
      console.error('Failed to fetch perps status:', e)
    } else {
      captureException(e, {
        ...SENTRY_MODULE_TAGS.PERPS,
        extra: {
          title: 'PERPS: Error fetching service status',
          httpStatus: statusCode.value,
          errorMessage: (e as Error).message || 'Unknown error',
        },
      })
    }
  } finally {
    isLoadingStatus.value = false
  }
  return statusCode.value
}

/**
 * True only while `/status` is answering with a server error. Everything else —
 * a 200, a 429 throttle, an unreachable endpoint, or the window before the first
 * response — reads as available, so the page never opens with an outage notice
 * it cannot substantiate.
 */
const isServiceUnavailable = computed(
  () => statusCode.value !== null && statusCode.value >= SERVER_ERROR_STATUS,
)

/**
 * Availability of the perps service, from its `/status` endpoint.
 *
 * When called from a component (or any active effect scope) the status is
 * refreshed on entry and kept warm on a timer that runs only while at least one
 * consumer is mounted — leaving the perps page stops the polling. Called
 * outside a scope it does a single fetch and never polls.
 */
export function usePerpsStatus() {
  if (getCurrentScope()) {
    consumers += 1
    if (consumers === 1) {
      // Refresh on (re)entry rather than trusting a value that may have gone
      // stale while nothing was watching it.
      void fetchPerpsStatus()
      pollTimer = setInterval(() => void fetchPerpsStatus(), POLL_INTERVAL_MS)
    }
    onScopeDispose(() => {
      consumers -= 1
      if (consumers === 0 && pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
      }
    })
  } else if (statusCode.value === null) {
    void fetchPerpsStatus()
  }

  return {
    statusCode,
    isServiceUnavailable,
    isLoadingStatus,
    refetch: fetchPerpsStatus,
  }
}
