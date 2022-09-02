const TheWalletView = () => import('@/views/TheWalletView');
const SendOffline = () =>
  import('@/views/layouts-wallet/TheSendTransactionOfflineLayout');
const SignMessage = () => import('@/views/layouts-wallet/TheSignMessageLayout');
const VerifyMessage = () =>
  import('@/views/layouts-wallet/TheVerifyMessageLayout');
import Network from '@/modules/network/ModuleNetwork';
import { ROUTES_WALLET } from '../configs/configRoutes';
export default {
  path: '/wallet',
  component: TheWalletView,
  props: true,
  children: [
    {
      path: ROUTES_WALLET.WALLETS.PATH,
      name: ROUTES_WALLET.WALLETS.NAME,
      component: SendOffline,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.NETWORK.PATH,
      name: ROUTES_WALLET.NETWORK.NAME,
      component: Network,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SEND_TX_OFFLINE.PATH,
      name: ROUTES_WALLET.SEND_TX_OFFLINE.NAME,
      component: SendOffline,
      props: true,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SIGN_MESSAGE.PATH,
      name: ROUTES_WALLET.SIGN_MESSAGE.NAME,
      component: SignMessage,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.VERIFY_MESSAGE.PATH,
      name: ROUTES_WALLET.VERIFY_MESSAGE.NAME,
      component: VerifyMessage,
      meta: {
        noAuth: false
      }
    }
  ]
};
