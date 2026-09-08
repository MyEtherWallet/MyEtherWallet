import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { Router, RouteRecordRaw } from 'vue-router'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  ACCESS_WALLET_VIEWS: ['default', 'ledger'],
  CREATE_WALLET_VIEWS: ['default'],
}))
// router.push awaits the lazy component factories, so stub both overlay views —
// otherwise this pulls in accessStore -> @/analytics -> Amplitude.
vi.mock('@/views/ViewAccessWallet.vue', () => ({
  default: { render: () => null },
}))
vi.mock('@/views/ViewCreateWallet.vue', () => ({
  default: { render: () => null },
}))

import { withWalletFlowRoutes } from '@/router/routesWalletFlow'

const Blank = { render: () => null }

/**
 * A synthetic stand-in for the real tree: a plain page, a page with a param'd child
 * dialog (the /crypto/token/:tokenId case), and an opted-out catch-all.
 */
const PAGES: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Blank },
  {
    path: '/crypto',
    name: 'Crypto',
    component: Blank,
    children: [
      { path: 'token/:tokenId', name: 'token-info-crypto', component: Blank },
    ],
  },
  { path: '/stocks', name: 'Stocks', component: Blank },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: Blank,
    meta: { noWalletFlow: true },
  },
]

let router: Router

beforeEach(() => {
  router = createRouter({
    history: createMemoryHistory(),
    routes: withWalletFlowRoutes(PAGES),
  })
})

describe('connect/create overlay navigation', () => {
  it('opens over the current page instead of /portfolio', async () => {
    await router.push({ name: 'Stocks-access' })
    expect(router.currentRoute.value.fullPath).toBe(
      '/stocks/access?type=default',
    )
  })

  it('resolves under a param’d host — the guard must forward to.params', async () => {
    // Regression test: a guard redirect resolves against the FROM route, so without
    // `params: to.params` the matcher throws `Missing required param "tokenId"`.
    await router.push('/stocks')
    await router.push('/crypto/token/peaq-2/access')
    const route = router.currentRoute.value
    expect(route.name).toBe('token-info-crypto-access')
    expect(route.params.tokenId).toBe('peaq-2')
    expect(route.fullPath).toBe('/crypto/token/peaq-2/access?type=default')
  })

  it('keeps a valid deep-linked step untouched', async () => {
    await router.push('/crypto/token/peaq-2/access?type=ledger')
    expect(router.currentRoute.value.query.type).toBe('ledger')
  })

  it('normalizes an invalid step while preserving the host’s other query', async () => {
    await router.push('/crypto/access?category=defi&type=bogus')
    const { query } = router.currentRoute.value
    expect(query.category).toBe('defi')
    expect(query.type).toBe('default')
  })

  it('still serves the canonical standalone routes by name', async () => {
    await router.push({ name: 'Access' })
    expect(router.currentRoute.value.fullPath).toBe('/access?type=default')
    await router.push({ name: 'CreateWallet' })
    expect(router.currentRoute.value.fullPath).toBe('/create?type=default')
  })

  it('inherits the host params from the current location with no explicit params', async () => {
    await router.push('/crypto/token/peaq-2')
    await router.push({ name: 'token-info-crypto-access' })
    expect(router.currentRoute.value.fullPath).toBe(
      '/crypto/token/peaq-2/access?type=default',
    )
  })

  it('falls through to not-found for an opted-out page', async () => {
    await router.push('/nope/access')
    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
