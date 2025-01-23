import { ROUTES_WALLET, ROUTES_SEND } from './routeNames';

const WalletLayoutDefault = () => import('@components/core_layouts/LayoutWallet.vue')
const TempView = () => import('@view-default/ViewTemp.vue')
const SendView = () => import('@/views/wallet/send/ViewSend.vue')
const ModuleSend = () => import('@/modules/send/ModuleSend.vue')
const ModuleSendNft = () => import('@/modules/nft/ModuleSendNft.vue')

const WalletRoutes = [{
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
      path: ROUTES_SEND.SEND.PATH,
      component: SendView,
      children: [
        {
          path: '',
          name: ROUTES_SEND.SEND.NAME,
          component: ModuleSend,
        },
        {
          path: ROUTES_SEND.SEND_NFT.PATH,
          name: ROUTES_SEND.SEND_NFT.NAME,
          component: ModuleSendNft,
        }
      ]
    }
  ]
}]

export default WalletRoutes
