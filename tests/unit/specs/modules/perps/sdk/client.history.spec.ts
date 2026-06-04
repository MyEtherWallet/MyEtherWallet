import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { PerpsClient } from '@/modules/perps/sdk/client'

describe('PerpsClient.getHistory', () => {
  let fetchSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ s: 'ok', t: [], c: [] }),
    })
    vi.stubGlobal('fetch', fetchSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('forwards an AbortSignal to fetch', async () => {
    const client = new PerpsClient('https://api.test')
    const controller = new AbortController()
    await client.getHistory('BTC-USD', '60', 0, 100, controller.signal)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [, init] = fetchSpy.mock.calls[0]
    expect(init?.signal).toBe(controller.signal)
  })

  it('works without an AbortSignal (back-compat)', async () => {
    const client = new PerpsClient('https://api.test')
    await client.getHistory('BTC-USD', '60', 0, 100)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [, init] = fetchSpy.mock.calls[0]
    expect(init?.signal).toBeUndefined()
  })
})
