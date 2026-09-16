import { afterEach, describe, expect, it, vi } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ fetchTradingRestriction: vi.fn() }),
}))

vi.mock('@/modules/access/common/walletConfigs', () => ({
  ACCESS_WALLET_VIEWS: ['default', 'ledger'],
  ACCESS_WALLET_VIEWS_DEFAULT: 'default',
  CREATE_WALLET_VIEWS: ['default'],
}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('development route build gating', () => {
  it('excludes /dev from a staging-mode production build', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('MODE', 'staging')
    vi.resetModules()

    const { PAGE_ROUTES } = await import('@/router/routesDefault')

    expect(
      (PAGE_ROUTES as RouteRecordRaw[]).some(route => route.path === '/dev'),
    ).toBe(false)
  })
})
