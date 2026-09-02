import { WALLET_FLOW_ROUTES, walletFlowRouteName } from './routeNames'
import { ACCESS_WALLET_VIEWS } from '@/modules/access/common/walletConfigs'
import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router'

const ViewAccessWallet = () => import('@/views/ViewAccessWallet.vue')

const beforeRouteEnter = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  //NOTE: IF this will be changed, ensure onMounted in ViewAccessWallet is changed accordingly
  const type = to.query.type
  if (
    typeof type === 'string' &&
    ACCESS_WALLET_VIEWS.includes(type as (typeof ACCESS_WALLET_VIEWS)[number])
  ) {
    next()
    return
  }
  if (typeof to.name !== 'string') {
    next()
    return
  }
  // Redirect to *this* record: there is one access route per host page, so there is no
  // fixed 'Access' name to fall back to. `params` MUST be forwarded — a guard redirect
  // is resolved against the CURRENT (from) location, not `to`, so a nested host's params
  // (/crypto/token/:tokenId/access) are not inherited and the matcher would throw
  // `Missing required param "tokenId"`. Other query keys are preserved so the host
  // page's deep-link state survives the overlay.
  next({
    name: to.name,
    params: to.params,
    query: { ...to.query, type: 'default' },
  })
}

/** Connect-wallet overlay, mounted as a child of `hostRouteName`'s record. */
export const accessRouteFor = (hostRouteName: string): RouteRecordRaw =>
  ({
    path: WALLET_FLOW_ROUTES.access.PATH,
    name: walletFlowRouteName(hostRouteName, 'access'),
    component: ViewAccessWallet,
    beforeEnter: beforeRouteEnter,
    // Kept explicitly rather than inherited: merged meta takes the deepest record's
    // value, so this keeps the connect flow reachable if a page route ever becomes
    // auth-gated — which is precisely when a user needs to connect.
    meta: { noAuth: true, walletFlow: 'access' },
  }) as RouteRecordRaw
