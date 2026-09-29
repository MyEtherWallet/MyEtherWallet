import { WALLET_FLOW_ROUTES, walletFlowRouteName } from './routeNames'
import { CREATE_WALLET_VIEWS } from '@/modules/access/common/walletConfigs'
import type {
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router'

const ViewCreateWallet = () => import('@/views/ViewCreateWallet.vue')

const beforeRouteEnter = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  //NOTE: IF this will be changed, ensure onMounted in ViewCreateWallet is changed accordingly
  const type = to.query.type
  if (
    typeof type === 'string' &&
    CREATE_WALLET_VIEWS.includes(type as (typeof CREATE_WALLET_VIEWS)[number])
  ) {
    next()
    return
  }
  if (typeof to.name !== 'string') {
    next()
    return
  }
  // See the identical guard in routesAccess.ts for why `params` must be forwarded.
  next({
    name: to.name,
    params: to.params,
    query: { ...to.query, type: 'default' },
  })
}

/** Create-wallet overlay, mounted as a child of `hostRouteName`'s record. */
export const createRouteFor = (hostRouteName: string): RouteRecordRaw =>
  ({
    path: WALLET_FLOW_ROUTES.create.PATH,
    name: walletFlowRouteName(hostRouteName, 'create'),
    component: ViewCreateWallet,
    beforeEnter: beforeRouteEnter,
    meta: { noAuth: true, walletFlow: 'create' },
  }) as RouteRecordRaw
