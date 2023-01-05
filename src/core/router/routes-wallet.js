import DappRoutes from '@/dapps/routes-dapps.js';
import { swapProps, swapRouterGuard } from './helpers';
import { ROUTES_WALLET } from '../configs/configRoutes';
export default {
  path: '/wallet',
  component: () => import('@/views/TheWalletView'),
  props: true,
  children: [
    {
      path: ROUTES_WALLET.WALLETS.PATH,
      name: ROUTES_WALLET.WALLETS.NAME,
      component: () => import('@/views/layouts-wallet/TheDashboardLayout'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.DASHBOARD.PATH,
      name: ROUTES_WALLET.DASHBOARD.NAME,
      component: () => import('@/views/layouts-wallet/TheDashboardLayout'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SETTINGS.PATH,
      name: ROUTES_WALLET.SETTINGS.NAME,
      component: () => import('@/modules/settings/ModuleSettings'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.PRINT.PATH,
      name: ROUTES_WALLET.PRINT.NAME,
      component: () => import('@/modules/balance/ModulePaperWallet'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SEND_TX.PATH,
      name: ROUTES_WALLET.SEND_TX.NAME,
      component: () =>
        import('@/views/layouts-wallet/TheSendTransactionLayout'),
      props: true,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.NFT_MANAGER.PATH,
      name: ROUTES_WALLET.NFT_MANAGER.NAME,
      component: () => import('@/views/layouts-wallet/TheNFTManagerLayout'),
      children: [
        {
          path: ROUTES_WALLET.NFT_MANAGER_SEND.PATH,
          name: ROUTES_WALLET.NFT_MANAGER_SEND.NAME,
          component: () =>
            import('@/modules/nft-manager/components/NftManagerSend'),
          meta: {
            noAuth: false
          }
        }
      ],
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SWAP.PATH,
      name: ROUTES_WALLET.SWAP.NAME,
      component: () => import('@/views/layouts-wallet/TheSwapLayout'),
      props: swapProps,
      beforeEnter: swapRouterGuard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.BRIDGE.PATH,
      name: ROUTES_WALLET.BRIDGE.NAME,
      component: () => import('@/views/layouts-wallet/TheBridgeLayout'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.DAPPS.PATH,
      component: () => import('@/views/layouts-wallet/TheDappCenterLayout.vue'),
      children: DappRoutes,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.DEPLOY_CONTRACT.PATH,
      name: ROUTES_WALLET.DEPLOY_CONTRACT.NAME,
      component: () => import('@/views/layouts-wallet/TheDeployContractLayout'),
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.INTERACT_WITH_CONTRACT.PATH,
      name: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME,
      component: () =>
        import('@/views/layouts-wallet/TheInteractContractLayout'),
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
