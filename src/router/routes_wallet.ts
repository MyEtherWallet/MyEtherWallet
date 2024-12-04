import { ROUTES_WALLET } from './routeNames';

const TempView = () => import('@view-default/ViewTemp.vue')

const DefaultRoutes = [{

  path: ROUTES_WALLET.WALLET.PATH,
  name: ROUTES_WALLET.WALLET.NAME,
  children: [
    {
      path: ROUTES_WALLET.DASHBOARD.PATH,
      name: ROUTES_WALLET.DASHBOARD.NAME,
      alias: '/dashboard',
      component: TempView,
    },
    {
      path: ROUTES_WALLET.SEND.PATH,
      name: ROUTES_WALLET.SEND.NAME,
      component: TempView,
    }
  ]
}]

export default DefaultRoutes

