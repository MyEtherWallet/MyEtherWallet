import TheWalletView from '@/views/TheWalletView';
import Dashboard from '@/views/layouts-wallet/TheDashboardLayout';
import Send from '@/views/layouts-wallet/TheSendTransactionLayout';
import NftManager from '@/views/layouts-wallet/TheNFTManagerLayout';
import Swap from '@/views/layouts-wallet/TheSwapLayout';
import InteractContract from '@/views/layouts-wallet/TheInteractContractLayout';
import DeployContract from '@/views/layouts-wallet/TheDeployContractLayout';
import SignMessage from '@/views/layouts-wallet/TheSignMessageLayout';
import verifyMessage from '@/views/layouts-wallet/TheVerifyMessageLayout';
import Dapps from '@/views/layouts-wallet/TheDappCenterLayout.vue';
import DappRoutes from '@/dapps/routes-dapps.js';
import { swapProps, swapRouterGuard } from './helpers';
export default {
  path: '/wallet',
  component: TheWalletView,
  props: true,
  children: [
    {
      path: '',
      name: 'Wallets',
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'send-tx',
      name: 'SendTX',
      component: Send,
      props: true,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'nft',
      name: 'NFTManager',
      component: NftManager,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'swap',
      name: 'Swap',
      component: Swap,
      props: swapProps,
      beforeEnter: swapRouterGuard,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'dapps',
      component: Dapps,
      children: DappRoutes,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'deploy',
      name: 'DeployContract',
      component: DeployContract,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'interact',
      name: 'InteractWithContract',
      component: InteractContract,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'sign',
      name: 'SignMessage',
      component: SignMessage,
      meta: {
        noAuth: false
      }
    },
    {
      path: 'verify',
      name: 'verifyMessage',
      component: verifyMessage,
      meta: {
        noAuth: false
      }
    }
  ]
};
