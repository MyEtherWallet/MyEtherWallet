import { describe, it, expect, vi } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

// routesDefault pulls this in at module load; stub it so importing the routes
// doesn't drag in globalStore's analytics / hw-wallet chain. The geo check moved
// from `useTradingRestriction` into globalStore, so the store is what needs
// stubbing now — this spec only reads route metadata and never runs the guard.
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ fetchTradingRestriction: vi.fn() }),
}))
// routesAccess/routesCreate import walletConfigs, which transitively loads the
// Ledger hw-wallet module (fails under jsdom) — stub the lists they need.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  ACCESS_WALLET_VIEWS: ['default', 'ledger'],
  ACCESS_WALLET_VIEWS_DEFAULT: 'default',
  CREATE_WALLET_VIEWS: ['default'],
}))

import DefaultRoutes from '@/router/routesDefault'

const route = (name: string): RouteRecordRaw | undefined =>
  (DefaultRoutes as RouteRecordRaw[]).find(r => r.name === name)

describe('/portfolio route (MEW-2216 — unconnected state)', () => {
  it('is noAuth so disconnected users see the connect-wallet state instead of bouncing to Home', () => {
    expect(route('Portfolio')?.meta?.noAuth).toBe(true)
  })
})
