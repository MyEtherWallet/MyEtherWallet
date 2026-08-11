import { PERP_INFO } from './routeNames'
const ViewPerpInfo = () => import('@/views/ViewPerpInfo.vue')

export const PERP_INFO_ROUTE = {
  path: PERP_INFO.PATH,
  component: ViewPerpInfo,
  props: true,
  meta: {
    noAuth: true,
  },
}
