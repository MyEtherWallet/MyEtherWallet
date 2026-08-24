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

const children = (name: string): RouteRecordRaw[] => {
  const route = (DefaultRoutes as RouteRecordRaw[]).find(r => r.name === name)
  return (route?.children ?? []) as RouteRecordRaw[]
}

describe('/access route (MEW-2182 — nested under Home)', () => {
  it('is a child of Home so /access resolves natively (no 404, no redirect)', () => {
    const home = children('Home')
    expect(home.some(r => r.path === 'access' && r.name === 'Access')).toBe(true)
  })

  it('is no longer a child of Portfolio', () => {
    const portfolio = children('Portfolio')
    expect(portfolio.some(r => r.path === 'access')).toBe(false)
  })
})
