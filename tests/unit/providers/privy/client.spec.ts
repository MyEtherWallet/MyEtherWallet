import { beforeEach, describe, expect, it, vi } from 'vitest'

const sdk = vi.hoisted(() => {
  const initialize = vi.fn<() => Promise<void>>()
  const created: Record<string, unknown>[] = []
  class FakePrivy {
    initialize = initialize
    constructor(options: Record<string, unknown>) {
      created.push(options)
    }
  }
  return { initialize, created, FakePrivy }
})

vi.mock('@privy-io/js-sdk-core', () => ({ default: sdk.FakePrivy }))
vi.mock('@/configs', () => ({
  default: { PRIVY_APP_ID: 'app-1', PRIVY_CLIENT_ID: 'client-1' },
}))

const loadClient = () => import('@/providers/privy/client')

describe('privy client', () => {
  beforeEach(() => {
    vi.resetModules()
    sdk.created.length = 0
    sdk.initialize.mockReset()
    sdk.initialize.mockResolvedValue(undefined)
  })

  it('builds one client with per-tab storage and the cookie copy turned off', async () => {
    await loadClient()
    const { tabStorage } = await import('@/providers/privy/tabStorage')

    expect(sdk.created).toHaveLength(1)
    expect(sdk.created[0]).toMatchObject({
      appId: 'app-1',
      clientId: 'client-1',
      sessions: { cookieWriteBehavior: 'never' },
    })
    expect(sdk.created[0].storage).toBe(tabStorage)
  })

  it('initializes the SDK once however many callers ask', async () => {
    const { privyReady } = await loadClient()

    await Promise.all([privyReady(), privyReady()])
    await privyReady()

    expect(sdk.initialize).toHaveBeenCalledTimes(1)
  })

  it('lets a later caller retry after initialize fails', async () => {
    sdk.initialize.mockRejectedValueOnce(new Error('storage blocked'))
    const { privyReady } = await loadClient()

    await expect(privyReady()).rejects.toThrow('storage blocked')
    await expect(privyReady()).resolves.toBeUndefined()
  })
})
