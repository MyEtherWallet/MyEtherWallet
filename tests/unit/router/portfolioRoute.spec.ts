import { describe, it, expect, vi } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

// routesDefault pulls this in at module load; stub it so importing the routes
// doesn't drag in the trading-restriction composable and its deps.
vi.mock('@/composables/useTradingRestriction', () => ({
  fetchTradingRestriction: vi.fn(),
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
