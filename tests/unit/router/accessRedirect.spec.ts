import { describe, it, expect, vi } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'

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

const accessRoute = DefaultRoutes.find(r => r.path === '/access')
const redirect = accessRoute?.redirect as (
  to: Pick<RouteLocationNormalized, 'query'>,
) => unknown

describe('/access route (MEW-2182)', () => {
  it('exists as a top-level route so /access no longer 404s', () => {
    expect(accessRoute).toBeTruthy()
    expect(typeof redirect).toBe('function')
  })

  it('redirects /access?type=default to Home, preserving the type', () => {
    expect(redirect({ query: { type: 'default' } })).toEqual({
      name: 'Home',
      query: { type: 'default' },
    })
  })

  it('defaults a missing type to the default connect view', () => {
    expect(redirect({ query: {} })).toEqual({
      name: 'Home',
      query: { type: 'default' },
    })
  })

  it('preserves the requested type and any other query params', () => {
    expect(redirect({ query: { type: 'ledger', ref: 'landing' } })).toEqual({
      name: 'Home',
      query: { type: 'ledger', ref: 'landing' },
    })
  })
})
