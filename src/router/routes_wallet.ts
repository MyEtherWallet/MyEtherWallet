import { ROUTES_WALLET } from './routeNames';

const TempView = () => import('@view-default/ViewTemp.vue')
const WalletLayoutDefault = () => import('@view-default/ViewWallet.vue')

const DefaultRoutes = [{
  path: ROUTES_WALLET.WALLET.PATH,
  name: ROUTES_WALLET.WALLET.NAME,
  component: WalletLayoutDefault,
  children: [
    {
      path: ROUTES_WALLET.DASHBOARD.PATH,
      name: ROUTES_WALLET.DASHBOARD.NAME,
      alias: '/wallet/dashboard',
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

