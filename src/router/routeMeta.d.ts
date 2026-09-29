import type { WalletFlowKind } from './routeNames'

declare module 'vue-router' {
  interface RouteMeta {
    /** Reachable with no wallet — see the guard in router/index.ts. */
    noAuth?: boolean
    /**
     * Set only on the generated connect/create overlay records. Its presence is what
     * distinguishes an overlay from the page underneath it, so `route.matched` can be
     * filtered down to real pages (routeHierarchy.ts).
     */
    walletFlow?: WalletFlowKind
    /** Page route that must NOT get overlay children (the 404 catch-all). */
    noWalletFlow?: boolean
  }
}
