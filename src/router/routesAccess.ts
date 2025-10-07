import { ROUTES_ACCESS } from './routeNames'
import { type RouterOptions } from 'vue-router'
import { WALLET_VIEWS } from '@/modules/access/common/walletConfigs'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
const ViewAccessWallet = () => import('@view-default/ViewAccessWallet.vue')

const beforeRouteEnter = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  //NOTE: IF this will be changed, ensure onMounted in ViewAccessWallet is changed accordingly
  if (
    to.query.type &&
    typeof to.query.type === 'string' &&
    WALLET_VIEWS.includes(to.query.type as (typeof WALLET_VIEWS)[number])
  ) {
    next()
  } else {
    console.log(
      'No or invalid wallet type provided, redirecting to default view',
    )
    next({ name: ROUTES_ACCESS.ACCESS.NAME, query: { type: 'default' } })
  }
}
type RouteOption = RouterOptions['routes'][0]
export const ACCESS_ROUTES = <RouteOption>{
  path: ROUTES_ACCESS.ACCESS.PATH,
  name: ROUTES_ACCESS.ACCESS.NAME,
  component: ViewAccessWallet,
  beforeEnter: beforeRouteEnter,
  meta: {
    noAuth: true,
  },
}
