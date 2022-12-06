import { ROUTES_WALLET } from '../configs/configRoutes';
export default {
  path: '/wallet',
  component: () => import('@/views/TheWalletView'),
  props: true,
  children: [
    {
      path: ROUTES_WALLET.WALLETS.PATH,
      name: ROUTES_WALLET.WALLETS.NAME,
      component: () =>
        import('@/views/layouts-wallet/TheSendTransactionOfflineLayout'),
      meta: {
        noAuth: false
      }
    },
    // {
    //   path: ROUTES_WALLET.NETWORK.PATH,
    //   name: ROUTES_WALLET.NETWORK.NAME,
    //   component: () => import('@/modules/network/ModuleNetwork'),
    //   meta: {
    //     noAuth: false
    //   }
    // },
    {
      path: ROUTES_WALLET.SEND_TX_OFFLINE.PATH,
      name: ROUTES_WALLET.SEND_TX_OFFLINE.NAME,
      component: () =>
        import('@/views/layouts-wallet/TheSendTransactionOfflineLayout'),
      props: true,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SIGN_MESSAGE.PATH,
      name: ROUTES_WALLET.SIGN_MESSAGE.NAME,
      component: () => import('@/views/layouts-wallet/TheSignMessageLayout'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.VERIFY_MESSAGE.PATH,
      name: ROUTES_WALLET.VERIFY_MESSAGE.NAME,
      component: () => import('@/views/layouts-wallet/TheVerifyMessageLayout'),
      meta: {
        noAuth: false
      }
    }
  ]
};
