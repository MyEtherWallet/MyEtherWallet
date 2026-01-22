import { STOCK_INFO } from './routeNames'
const ViewStockInfo = () => import('@/views/ViewStockInfo.vue')

export const STOCK_INFO_ROUTE = {
  path: STOCK_INFO.PATH,
  component: ViewStockInfo,
  props: true,
  meta: {
    noAuth: true,
  },
}
