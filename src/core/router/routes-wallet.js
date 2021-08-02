import TheWalletView from '@/views/TheWalletView';
import Dashboard from '@/views/layouts-wallet/TheDashboardLayout';
import Send from '@/views/layouts-wallet/TheSendTransactionLayout';
import NftManager from '@/views/layouts-wallet/TheNFTManagerLayout';
import Swap from '@/views/layouts-wallet/TheSwapLayout';
import InteractContract from '@/views/layouts-wallet/TheInteractContractLayout';
import DeployContract from '@/views/layouts-wallet/TheDeployContractLayout';
import SignMessage from '@/views/layouts-wallet/TheSignMessageLayout';
import VerifyMessage from '@/views/layouts-wallet/TheVerifyMessageLayout';
import Dapps from '@/views/layouts-wallet/TheDappCenterLayout.vue';
import DappRoutes from '@/dapps/routes-dapps.js';
import Settings from '@/modules/settings/ModuleSettings';
import NftManagerSend from '@/modules/nft-manager/components/NftManagerSend';
import Notifications from '@/modules/notifications/ModuleNotifications';
import { swapProps, swapRouterGuard } from './helpers';
import { ROUTES_WALLET } from '../configs/configRoutes';
export default {
  path: '/wallet',
  component: TheWalletView,
  props: true,
  children: [
    {
      path: ROUTES_WALLET.WALLETS.PATH,
      name: ROUTES_WALLET.WALLETS.NAME,
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.DASHBOARD.PATH,
      name: ROUTES_WALLET.DASHBOARD.NAME,
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SETTINGS.PATH,
      name: ROUTES_WALLET.SETTINGS.NAME,
      component: Settings,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SEND_TX.PATH,
      name: ROUTES_WALLET.SEND_TX.NAME,
      component: Send,
      props: true,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.NFT_MANAGER.PATH,
      name: ROUTES_WALLET.NFT_MANAGER.NAME,
      component: NftManager,
      children: [
        {
          path: ROUTES_WALLET.NFT_MANAGER_SEND.PATH,
          name: ROUTES_WALLET.NFT_MANAGER_SEND.NAME,
          component: NftManagerSend,
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
      path: ROUTES_WALLET.NOTIFICATIONS.PATH,
      name: ROUTES_WALLET.NOTIFICATIONS.NAME,
      component: Notifications,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SWAP.PATH,
      name: ROUTES_WALLET.SWAP.NAME,
      component: Swap,
      props: swapProps,
      beforeEnter: swapRouterGuard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.DAPPS.PATH,
      component: Dapps,
      children: DappRoutes,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.DEPLOY_CONTRACT.PATH,
      name: ROUTES_WALLET.DEPLOY_CONTRACT.NAME,
      component: DeployContract,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.INTERACT_WITH_CONTRACT.PATH,
      name: ROUTES_WALLET.INTERACT_WITH_CONTRACT.NAME,
      component: InteractContract,
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
