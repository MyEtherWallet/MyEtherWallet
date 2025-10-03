import { ROUTES_MAIN } from '../routeNames'
const ViewTokenInfo = () => import('@/views/wallet/crypto/ViewTokenInfo.vue')

export const TOKEN_INFO_ROUTE = {
  path: ROUTES_MAIN.TOKEN_INFO.PATH,
  name: ROUTES_MAIN.TOKEN_INFO.NAME,
  component: ViewTokenInfo,
  props: true,
  meta: {
    noAuth: true,
  },
}
