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
import { swapProps, swapRouterGuard, ROUTES } from './helpers';
export default {
  path: '/wallet',
  component: TheWalletView,
  props: true,
  children: [
    {
      path: ROUTES.Wallets.Path,
      name: ROUTES.Wallets.Name,
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.Dashboard.Path,
      name: ROUTES.Dashboard.Name,
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.SendTX.Path,
      name: ROUTES.SendTX.Name,
      component: Send,
      props: true,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.NFTManager.Path,
      name: ROUTES.NFTManager.Name,
      component: NftManager,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.Swap.Path,
      name: ROUTES.Swap.Name,
      component: Swap,
      props: swapProps,
      beforeEnter: swapRouterGuard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.Dapps.Path,
      component: Dapps,
      children: DappRoutes,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.DeployContract.Path,
      name: ROUTES.DeployContract.Name,
      component: DeployContract,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.InteractWithContract.Path,
      name: ROUTES.InteractWithContract.Name,
      component: InteractContract,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.SignMessage.Path,
      name: ROUTES.SignMessage.Name,
      component: SignMessage,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES.VerifyMessage.Path,
      name: ROUTES.VerifyMessage.Name,
      component: verifyMessage,
      meta: {
        noAuth: false
      }
    }
  ]
};
