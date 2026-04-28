import { ROUTES_CREATE_WALLET } from './routeNames'
import { type RouterOptions } from 'vue-router'
import { CREATE_WALLET_VIEWS } from '@/modules/access/common/walletConfigs'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const ViewCreateWallet = () => import('@/views/ViewCreateWallet.vue')

const beforeRouteEnter = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  //NOTE: IF this will be changed, ensure onMounted in ViewAccessWallet is changed accordingly
  if (
    to.query.type &&
    typeof to.query.type === 'string' &&
    CREATE_WALLET_VIEWS.includes(
      to.query.type as (typeof CREATE_WALLET_VIEWS)[number],
    )
  ) {
    next()
  } else {
    next({
      name: ROUTES_CREATE_WALLET.CREATE_WALLET.NAME,
      query: { type: 'default' },
    })
  }
}
type RouteOption = RouterOptions['routes'][0]
export const CREATE_ROUTES = <RouteOption>{
  path: ROUTES_CREATE_WALLET.CREATE_WALLET.PATH,
  name: ROUTES_CREATE_WALLET.CREATE_WALLET.NAME,
  component: ViewCreateWallet,
  beforeEnter: beforeRouteEnter,
  meta: {
    noAuth: true,
  },
}
