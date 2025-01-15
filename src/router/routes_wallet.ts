import { ROUTES_WALLET } from './routeNames'

const WalletLayoutDefault = () => import('@components/core_layouts/LayoutWallet.vue')
const TempView = () => import('@view-default/ViewTemp.vue')
const SendView = () => import('@/modules/send/ViewSend.vue')

const WalletRoutes = [
  {
    path: ROUTES_WALLET.WALLET.PATH,
    component: WalletLayoutDefault,
    children: [
      {
        path: '',
        name: ROUTES_WALLET.DASHBOARD.NAME,
        alias: ROUTES_WALLET.DASHBOARD.PATH,
        component: TempView,
      },
      {
        path: ROUTES_WALLET.SEND.PATH,
        name: ROUTES_WALLET.SEND.NAME,
        component: SendView,
      },
    ],
  },
]

export default WalletRoutes
