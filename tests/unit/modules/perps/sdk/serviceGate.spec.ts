import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  PerpsClient,
  PerpsHttpError,
  PerpsServiceUnavailableError,
} from '@/modules/perps/sdk/client'

const BASE = 'https://perps.example.test'

const okResponse = (body: unknown = { success: true, result: {} }) =>
  ({
    ok: true,
    status: 200,
    json: async () => body,
  }) as Response

const errorResponse = (status: number) =>
  ({
    ok: false,
    status,
    json: async () => ({ error: `boom ${status}` }),
  }) as Response

describe('PerpsClient service gate', () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let client: PerpsClient

  beforeEach(() => {
    fetchMock = vi.fn(async () => okResponse())
    vi.stubGlobal('fetch', fetchMock)
    client = new PerpsClient(BASE)
    client.setToken('token')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is open by default, so nothing is gated until an outage is observed', async () => {
    expect(client.isServiceUnavailable()).toBe(false)

    await client.getMarkets()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fires no request at all once marked unavailable', async () => {
    client.setServiceUnavailable(true)

    await expect(client.getMarkets()).rejects.toBeInstanceOf(
      PerpsServiceUnavailableError,
    )

    // The point of the gate: not a failed request, no request.
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('gates authenticated reads, writes and deletes alike', async () => {
    client.setServiceUnavailable(true)

    await expect(client.getAccount()).rejects.toBeInstanceOf(
      PerpsServiceUnavailableError,
    )
    await expect(
      client.createOrder({ market: 'BTC-USD' } as never),
    ).rejects.toBeInstanceOf(PerpsServiceUnavailableError)
    await expect(client.cancelOrder('order-1')).rejects.toBeInstanceOf(
      PerpsServiceUnavailableError,
    )

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('keeps /status reachable, so the outage can be detected as over', async () => {
    client.setServiceUnavailable(true)

    await client.getStatus()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE}/status`)
  })

  it('reopens for everything once marked available again', async () => {
    client.setServiceUnavailable(true)
    await expect(client.getMarkets()).rejects.toBeInstanceOf(
      PerpsServiceUnavailableError,
    )

    client.setServiceUnavailable(false)
    await client.getMarkets()

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('still surfaces real HTTP failures with their status while open', async () => {
    fetchMock.mockResolvedValue(errorResponse(500))

    await expect(client.getMarkets()).rejects.toBeInstanceOf(PerpsHttpError)
  })

  it('does not conflate the gate with a response — no status to report', async () => {
    client.setServiceUnavailable(true)

    const error = await client.getMarkets().catch(e => e)

    // A caller inspecting `.status` must not read the gate as a 5xx response.
    expect(error).not.toBeInstanceOf(PerpsHttpError)
    expect((error as { status?: number }).status).toBeUndefined()
  })
})
