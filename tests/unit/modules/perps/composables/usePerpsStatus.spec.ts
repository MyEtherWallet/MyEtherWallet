import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

// Hoisted so the mock factory below can reference them.
const { getStatus, setServiceUnavailable } = vi.hoisted(() => ({
  // Implementation is swapped per test rather than using mockResolvedValue,
  // whose vitest typings infer `never` for this signature.
  getStatus: vi.fn(
    (): Promise<{ success: boolean; result: { marketStatus: string } }> =>
      Promise.resolve({ success: true, result: { marketStatus: 'open' } }),
  ),
  setServiceUnavailable: vi.fn(),
}))

// Mocked so the spec never constructs the real client (and never hits the API).
vi.mock('@/modules/perps/configs', () => ({
  perpsClient: {
    getStatus: () => getStatus(),
    setServiceUnavailable: (unavailable: boolean) =>
      setServiceUnavailable(unavailable),
  },
}))

import { PerpsHttpError } from '@/modules/perps/sdk/client'
import {
  usePerpsStatus,
  fetchPerpsStatus,
} from '@/modules/perps/composables/usePerpsStatus'

const respondsOk = () =>
  getStatus.mockImplementation(() =>
    Promise.resolve({ success: true, result: { marketStatus: 'open' } }),
  )

/** What the real client does for a non-2xx: throw, carrying the status. */
const respondsWith = (status: number) =>
  getStatus.mockImplementation(() =>
    Promise.reject(new PerpsHttpError(status, `HTTP ${status}`)),
  )

describe('usePerpsStatus', () => {
  // Status is shared across consumers and owned by `perpsStatusStore`, so a
  // fresh pinia per case is all the isolation needed.
  beforeEach(() => {
    setActivePinia(createPinia())
    getStatus.mockReset()
    setServiceUnavailable.mockClear()
    respondsOk()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reads as available before the first response, so the banner never flashes on load', () => {
    // Never settles: this is the pre-resolution window.
    getStatus.mockImplementation(() => new Promise(() => {}))

    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    expect(statusCode.value).toBeNull()
    expect(isServiceUnavailable.value).toBe(false)
  })

  it('stays available on 200', async () => {
    respondsOk()
    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(statusCode.value).toBe(200)
    expect(isServiceUnavailable.value).toBe(false)
  })

  it('stays available on 429 — a throttle means the service answered', async () => {
    respondsWith(429)
    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(statusCode.value).toBe(429)
    expect(isServiceUnavailable.value).toBe(false)
  })

  it('reports unavailable on 500', async () => {
    respondsWith(500)
    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(statusCode.value).toBe(500)
    expect(isServiceUnavailable.value).toBe(true)
  })

  it('reports unavailable for any other server error', async () => {
    // 502/503 are the same outage class as the documented 500.
    respondsWith(503)
    const { isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(isServiceUnavailable.value).toBe(true)
  })

  it('stays available for a client error that is not a server outage', async () => {
    respondsWith(404)
    const { isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(isServiceUnavailable.value).toBe(false)
  })

  it('stays available when the request never reaches a response', async () => {
    // Offline / DNS / CORS: no HTTP status, so nothing to substantiate an
    // outage notice with — this is the user's connection, not the service.
    getStatus.mockImplementation(() =>
      Promise.reject(new Error('Failed to fetch')),
    )
    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(statusCode.value).toBeNull()
    expect(isServiceUnavailable.value).toBe(false)
  })

  it('clears the banner once the service recovers', async () => {
    respondsWith(500)
    const { isServiceUnavailable } = usePerpsStatus()
    await fetchPerpsStatus()
    expect(isServiceUnavailable.value).toBe(true)

    respondsOk()
    await fetchPerpsStatus()

    expect(isServiceUnavailable.value).toBe(false)
  })

  it('polls while a consumer is alive and stops once the scope is disposed', async () => {
    vi.useFakeTimers()

    const scope = effectScope()
    scope.run(() => usePerpsStatus())
    expect(getStatus).toHaveBeenCalledTimes(1) // immediate fetch on entry

    await vi.advanceTimersByTimeAsync(60_000)
    expect(getStatus).toHaveBeenCalledTimes(2)

    scope.stop()
    await vi.advanceTimersByTimeAsync(180_000)
    expect(getStatus).toHaveBeenCalledTimes(2)
  })

  it('shares one poll timer across concurrent consumers', async () => {
    vi.useFakeTimers()

    const first = effectScope()
    const second = effectScope()
    first.run(() => usePerpsStatus())
    second.run(() => usePerpsStatus())

    // Second consumer joins the existing timer instead of starting its own.
    expect(getStatus).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(60_000)
    expect(getStatus).toHaveBeenCalledTimes(2)

    // One consumer leaving must not stop polling for the other.
    first.stop()
    await vi.advanceTimersByTimeAsync(60_000)
    expect(getStatus).toHaveBeenCalledTimes(3)

    second.stop()
    await vi.advanceTimersByTimeAsync(60_000)
    expect(getStatus).toHaveBeenCalledTimes(3)
  })

  describe('gating the rest of the perps client', () => {
    it('closes the gate on a 500, so no other endpoint is called', async () => {
      respondsWith(500)

      await fetchPerpsStatus()

      expect(setServiceUnavailable).toHaveBeenLastCalledWith(true)
    })

    it('leaves the gate open on a 200', async () => {
      respondsOk()

      await fetchPerpsStatus()

      expect(setServiceUnavailable).toHaveBeenLastCalledWith(false)
    })

    it('leaves the gate open on a 429 — a throttle is not an outage', async () => {
      respondsWith(429)

      await fetchPerpsStatus()

      expect(setServiceUnavailable).toHaveBeenLastCalledWith(false)
    })

    it('leaves the gate open when the request never reached a response', async () => {
      getStatus.mockImplementation(() =>
        Promise.reject(new Error('Failed to fetch')),
      )

      await fetchPerpsStatus()

      // Offline is the user's connection, not the service — blocking every perps
      // call on it would be a self-inflicted outage.
      expect(setServiceUnavailable).toHaveBeenLastCalledWith(false)
    })

    it('reopens the gate on the poll after a recovery', async () => {
      respondsWith(500)
      await fetchPerpsStatus()
      expect(setServiceUnavailable).toHaveBeenLastCalledWith(true)

      respondsOk()
      await fetchPerpsStatus()

      expect(setServiceUnavailable).toHaveBeenLastCalledWith(false)
    })
  })
})
