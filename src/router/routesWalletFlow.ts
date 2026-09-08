import { accessRouteFor } from './routesAccess'
import { createRouteFor } from './routesCreate'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Appends the connect/create overlay routes to every named page route, recursively, so
 * both open on top of the page the user is already on — /access, /stocks/access,
 * /crypto/token/peaq-2/access — and cancelling returns there instead of rerouting to
 * Home (and without /portfolio painting itself in behind the modal).
 *
 * Opt out with `meta.noWalletFlow: true`. A record that opts *in* MUST render a
 * <router-view/>, or the overlay silently never mounts and the CTA dead-ends —
 * walletFlowOutlets.spec.ts guards that.
 */
export const withWalletFlowRoutes = (
  routes: readonly RouteRecordRaw[],
): RouteRecordRaw[] =>
  routes.map(record => {
    // Recurse first, then append: the overlays added here are never themselves
    // decorated, so access/create can't nest inside each other.
    // Never mutate — TOKEN_INFO_ROUTE / STOCK_INFO_ROUTE are single objects spread into
    // several parents, so writing to one would give every parent the same children.
    const children = record.children
      ? withWalletFlowRoutes(record.children)
      : undefined
    if (typeof record.name !== 'string' || record.meta?.noWalletFlow) {
      return { ...record, ...(children ? { children } : {}) } as RouteRecordRaw
    }
    return {
      ...record,
      children: [
        ...(children ?? []),
        accessRouteFor(record.name),
        createRouteFor(record.name),
      ],
    } as RouteRecordRaw
  })
