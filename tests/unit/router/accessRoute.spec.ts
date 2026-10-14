import { describe, it, expect, vi } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

// routesDefault pulls this in at module load; stub it so importing the routes doesn't
// drag in globalStore's analytics / hw-wallet chain. The geo check lives in globalStore
// (it used to be `useTradingRestriction`, which no longer exists), so the store is what
// needs stubbing — same as portfolioRoute.spec.ts.
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

const children = (name: string): RouteRecordRaw[] => {
  const route = (DefaultRoutes as RouteRecordRaw[]).find(r => r.name === name)
  return (route?.children ?? []) as RouteRecordRaw[]
}

describe('/access route (MEW-2182 — nested under Home)', () => {
  it('is a child of Home so /access resolves natively (no 404, no redirect)', () => {
    const home = children('Home')
    expect(home.some(r => r.path === 'access' && r.name === 'Access')).toBe(true)
  })

  it('no longer owns the canonical Access route under Portfolio', () => {
    // Portfolio does still get an access child — the connect/create overlays are
    // appended to every page route so the flow opens over wherever the user is
    // (routesWalletFlow.ts). What it must NOT own is the *canonical* 'Access', which
    // now belongs to Home; that ownership is what made /access 404 and what sent a
    // user connecting from /stocks to /portfolio/access with the portfolio painted in
    // behind the modal.
    const portfolio = children('Portfolio')
    expect(portfolio.some(r => r.name === 'Access')).toBe(false)
    expect(portfolio.some(r => r.name === 'Portfolio-access')).toBe(true)
  })
})
