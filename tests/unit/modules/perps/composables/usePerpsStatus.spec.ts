import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope } from 'vue'

// Implementation is swapped per test rather than using mockResolvedValue, whose
// vitest typings infer `never` for this signature.
const getStatus = vi.fn(
  (): Promise<{ success: boolean; result: { marketStatus: string } }> =>
    Promise.resolve({ success: true, result: { marketStatus: 'open' } }),
)

// Mocked so the spec never constructs the real client (and never hits the API).
vi.mock('@/modules/perps/configs', () => ({
  perpsClient: { getStatus: () => getStatus() },
}))

const respondsOk = () =>
  getStatus.mockImplementation(() =>
    Promise.resolve({ success: true, result: { marketStatus: 'open' } }),
  )

// Status lives in module scope and is shared across consumers, so every case
// needs a freshly imported module graph.
//
// `PerpsHttpError` has to come from that same graph: the composable narrows with
// `instanceof`, and a class imported at the top of this file would be a
// different identity after `resetModules`, so every error would look like a
// response-less failure. Hence `respondsWith` is handed back per import rather
// than defined once at module scope.
const freshImport = async () => {
  vi.resetModules()
  const { PerpsHttpError } = await import('@/modules/perps/sdk/client')
  const mod = await import('@/modules/perps/composables/usePerpsStatus')
  return {
    ...mod,
    /** What the real client does for a non-2xx: throw, carrying the status. */
    respondsWith: (status: number) =>
      getStatus.mockImplementation(() =>
        Promise.reject(new PerpsHttpError(status, `HTTP ${status}`)),
      ),
  }
}

describe('usePerpsStatus', () => {
  beforeEach(() => {
    getStatus.mockReset()
    respondsOk()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetModules()
  })

  it('reads as available before the first response, so the banner never flashes on load', async () => {
    const { usePerpsStatus } = await freshImport()
    // Never settles: this is the pre-resolution window.
    getStatus.mockImplementation(() => new Promise(() => {}))

    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    expect(statusCode.value).toBeNull()
    expect(isServiceUnavailable.value).toBe(false)
  })

  it('stays available on 200', async () => {
    const { usePerpsStatus, fetchPerpsStatus } = await freshImport()
    respondsOk()
    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(statusCode.value).toBe(200)
    expect(isServiceUnavailable.value).toBe(false)
  })

  it('stays available on 429 — a throttle means the service answered', async () => {
    const { usePerpsStatus, fetchPerpsStatus, respondsWith } =
      await freshImport()
    respondsWith(429)
    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(statusCode.value).toBe(429)
    expect(isServiceUnavailable.value).toBe(false)
  })

  it('reports unavailable on 500', async () => {
    const { usePerpsStatus, fetchPerpsStatus, respondsWith } =
      await freshImport()
    respondsWith(500)
    const { statusCode, isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(statusCode.value).toBe(500)
    expect(isServiceUnavailable.value).toBe(true)
  })

  it('reports unavailable for any other server error', async () => {
    const { usePerpsStatus, fetchPerpsStatus, respondsWith } =
      await freshImport()
    // 502/503 are the same outage class as the documented 500.
    respondsWith(503)
    const { isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(isServiceUnavailable.value).toBe(true)
  })

  it('stays available for a client error that is not a server outage', async () => {
    const { usePerpsStatus, fetchPerpsStatus, respondsWith } =
      await freshImport()
    respondsWith(404)
    const { isServiceUnavailable } = usePerpsStatus()

    await fetchPerpsStatus()

    expect(isServiceUnavailable.value).toBe(false)
  })

  it('stays available when the request never reaches a response', async () => {
    const { usePerpsStatus, fetchPerpsStatus } = await freshImport()
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
    const { usePerpsStatus, fetchPerpsStatus, respondsWith } =
      await freshImport()
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
    const { usePerpsStatus } = await freshImport()

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
    const { usePerpsStatus } = await freshImport()

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
})
