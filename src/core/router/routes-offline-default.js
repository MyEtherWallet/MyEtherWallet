import { ROUTES_HOME } from '../configs/configRoutes';
import { accessWalletProps, accessRouteGuard } from './helpers';

export default {
  path: '/',
  component: () => import('@/views/TheOfflineDefaultView'),
  props: true,
  children: [
    {
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: () => import('@/views/layouts-default/TheAccessWalletLayout'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: () => import('@/views/layouts-default/TheAccessWalletLayout'),
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      component: () => import('@/views/layouts-default/TheCreateWalletLayout'),
      meta: {
        noAuth: true,
        title: 'Create A Crypto Wallet | Mobile and Browser Crypto Wallets',
        description:
          'Create a secure self custody crypto wallet using MyEtherWallet. Choose from our mobile app or browser extension wallet.'
      },
      children: [
        {
          path: '',
          name: ROUTES_HOME.CREATE_WALLET.NAME,
          component: () =>
            import('@/modules/create-wallet/components/CreateWalletButtons'),
          meta: {
            noAuth: true,
            title: 'Create A Crypto Wallet | Mobile and Browser Crypto Wallets',
            description:
              'Create a secure self custody crypto wallet using MyEtherWallet. Choose from our mobile app or browser extension wallet.'
          }
        },
        {
          path: ROUTES_HOME.CREATE_WALLET_SOFTWARE_OVERVIEW.PATH,
          name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_OVERVIEW.NAME,
          component: () =>
            import(
              '@/modules/create-wallet/components/CreateWalletSoftwareOverview.vue'
            ),
          meta: {
            noAuth: true,
            title: 'Create A Crypto Wallet | Mobile and Browser Crypto Wallets',
            description:
              'Create a secure self custody crypto wallet using MyEtherWallet. Choose from our mobile app or browser extension wallet.'
          }
        },
        {
          path: ROUTES_HOME.CREATE_WALLET_SOFTWARE_MNEMONIC.PATH,
          name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_MNEMONIC.NAME,
          component: () =>
            import(
              '@/modules/create-wallet/components/CreateWalletMnemonicPhrase'
            ),
          meta: {
            noAuth: true,
            title: 'Create A Crypto Wallet | Mobile and Browser Crypto Wallets',
            description:
              'Create a secure self custody crypto wallet using MyEtherWallet. Choose from our mobile app or browser extension wallet.'
          }
        },
        {
          path: ROUTES_HOME.CREATE_WALLET_SOFTWARE_KEYSTORE.PATH,
          name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_KEYSTORE.NAME,
          component: () =>
            import(
              '@/modules/create-wallet/components/CreateWalletKeystore.vue'
            ),
          meta: {
            noAuth: true,
            title: 'Create A Crypto Wallet | Mobile and Browser Crypto Wallets',
            description:
              'Create a secure self custody crypto wallet using MyEtherWallet. Choose from our mobile app or browser extension wallet.'
          }
        }
      ]
    }
  ]
};
