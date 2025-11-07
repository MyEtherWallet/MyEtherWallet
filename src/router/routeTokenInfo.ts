import { TOKEN_INFO } from './routeNames'
const ViewTokenInfo = () => import('@/views/ViewTokenInfo.vue')

export const TOKEN_INFO_ROUTE = {
  path: TOKEN_INFO.PATH,
  component: ViewTokenInfo,
  props: true,
  meta: {
    noAuth: true,
  },
}
