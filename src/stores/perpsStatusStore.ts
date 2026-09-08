import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { perpsClient } from '@/modules/perps/configs'
import { PerpsHttpError } from '@/modules/perps/sdk/client'
import { capturePerps } from '@/modules/perps/sentry'
import { PERPS_FEATURE } from '@/sentry/constants'

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

/**
 * Availability of the perps service, from its `/status` endpoint. Every surface
 * reads the same status, so the page banner and any other consumer can never
 * disagree.
 *
 * Polling is reference-counted rather than started here: it runs only while at
 * least one consumer is mounted, so leaving the perps page stops it. Consumers
 * go through `usePerpsStatus()`, which owns that bookkeeping.
 */
export const usePerpsStatusStore = defineStore('perpsStatus', () => {
  /**
   * The last HTTP status observed from `/status`, or `null` before the first
   * response — and also when a request never reached one (offline, DNS, CORS,
   * aborted), which is indistinguishable from "unknown" for our purposes and
   * deliberately does not raise the banner.
   */
  const statusCode = ref<number | null>(null)
  const isLoadingStatus = ref(false)

  let pollTimer: ReturnType<typeof setInterval> | null = null
  let consumers = 0

  /**
   * True only while `/status` is answering with a server error. Everything
   * else — a 200, a 429 throttle, an unreachable endpoint, or the window before
   * the first response — reads as available, so the page never opens with an
   * outage notice it cannot substantiate.
   */
  const isServiceUnavailable = computed(
    () => statusCode.value !== null && statusCode.value >= SERVER_ERROR_STATUS,
  )

  /**
   * Pings `/status` and returns the HTTP status it answered with (`null` if it
   * never answered).
   *
   * Only the response code is consulted — the `marketStatus` field in the body
   * is not read, since availability is what the banner reports.
   */
  const fetchStatus = async (): Promise<number | null> => {
    isLoadingStatus.value = true
    try {
      await perpsClient.getStatus()
      statusCode.value = 200
    } catch (e) {
      statusCode.value = e instanceof PerpsHttpError ? e.status : null
      capturePerps(PERPS_FEATURE.STATUS, e, {
        title: 'PERPS: Error fetching service status',
        extra: { httpStatus: statusCode.value },
      })
    } finally {
      isLoadingStatus.value = false
    }
    // Push the verdict into the client so every other perps endpoint is gated on
    // it: while the service is down they fail immediately instead of each firing
    // its own doomed request. Set on every poll, so a recovery reopens the gate.
    perpsClient.setServiceUnavailable(isServiceUnavailable.value)
    return statusCode.value
  }

  /**
   * Register a live consumer. The first one refreshes on entry — rather than
   * trusting a value that may have gone stale while nothing was watching it —
   * and starts the shared timer; later ones join it.
   */
  const acquire = () => {
    consumers += 1
    if (consumers > 1) return
    void fetchStatus()
    pollTimer = setInterval(() => void fetchStatus(), POLL_INTERVAL_MS)
  }

  /** Drop a consumer, stopping the timer once the last one is gone. */
  const release = () => {
    consumers = Math.max(0, consumers - 1)
    if (consumers > 0 || !pollTimer) return
    clearInterval(pollTimer)
    pollTimer = null
  }

  return {
    statusCode,
    isLoadingStatus,
    isServiceUnavailable,
    fetchStatus,
    acquire,
    release,
  }
})
