import { describe, it, expect, vi } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'

// routesDefault pulls this in at module load; stub it so importing the routes doesn't
// drag in globalStore's analytics / hw-wallet chain.
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ fetchTradingRestriction: vi.fn() }),
}))
// routesAccess/routesCreate import walletConfigs, which transitively loads the Ledger
// hw-wallet module (fails under jsdom) — stub the lists they need.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  ACCESS_WALLET_VIEWS: ['default', 'ledger'],
  CREATE_WALLET_VIEWS: ['default'],
}))

import DecoratedRoutes, { PAGE_ROUTES } from '@/router/routesDefault'

type Record_ = RouteRecordRaw & { children?: RouteRecordRaw[] }

const walk = (routes: readonly RouteRecordRaw[]): Record_[] =>
  (routes as Record_[]).flatMap(r => [r, ...walk(r.children ?? [])])

const allRecords = walk(DecoratedRoutes)
const overlays = allRecords.filter(r => r.meta?.walletFlow)
/** Every page record that should have received the overlay pair. */
const hosts = walk(PAGE_ROUTES).filter(
  r => typeof r.name === 'string' && !r.meta?.noWalletFlow,
)

const childrenOf = (name: string): Record_[] => {
  const record = allRecords.find(r => r.name === name)
  return (record?.children ?? []) as Record_[]
}

describe('connect/create overlay routes (appended to every page)', () => {
  it('gives every opted-in page route exactly one access and one create child', () => {
    for (const host of hosts) {
      const kinds = childrenOf(host.name as string)
        .map(c => c.meta?.walletFlow)
        .filter(Boolean)
      expect(kinds.sort(), `host ${String(host.name)}`).toEqual([
        'access',
        'create',
      ])
    }
  })

  it('hosts the canonical standalone pair on Home, so /access and /create exist', () => {
    const home = childrenOf('Home')
    expect(home.find(c => c.meta?.walletFlow === 'access')).toMatchObject({
      name: 'Access',
      path: 'access',
    })
    expect(home.find(c => c.meta?.walletFlow === 'create')).toMatchObject({
      name: 'CreateWallet',
      path: 'create',
    })
  })

  it('suffixes every non-Home host so the names stay unique', () => {
    const overlayNames = (host: string) =>
      childrenOf(host)
        .filter(c => c.meta?.walletFlow)
        .map(c => c.name)
    // Appended after the host's own children (Stocks already has two info routes).
    expect(overlayNames('Stocks')).toEqual(['Stocks-access', 'Stocks-create'])
    // The deep case from the bug report: /crypto/token/:tokenId/access
    expect(overlayNames('token-info-crypto')).toEqual([
      'token-info-crypto-access',
      'token-info-crypto-create',
    ])
  })

  it('never nests an overlay inside another overlay', () => {
    for (const overlay of overlays) {
      expect(overlay.children, String(overlay.name)).toBeUndefined()
    }
  })

  it('keeps every overlay noAuth — connecting is exactly what a wallet-less user needs', () => {
    for (const overlay of overlays) {
      expect(overlay.meta?.noAuth, String(overlay.name)).toBe(true)
    }
  })

  it('opts the 404 catch-all out (no outlet, and the matcher would be nonsense)', () => {
    expect(childrenOf('not-found')).toHaveLength(0)
  })

  it('keeps all route names unique so no matcher is silently clobbered', () => {
    const names = allRecords.map(r => r.name).filter(Boolean)
    expect(new Set(names).size).toBe(names.length)
  })

  it('covers 21 hosts with 42 overlay records', () => {
    // A canary: if this drifts, a page route was added without an outlet or a host
    // silently stopped being decorated.
    expect(hosts).toHaveLength(21)
    expect(overlays).toHaveLength(42)
  })
})
