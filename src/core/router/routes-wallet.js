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
import { swapProps, swapRouterGuard, ROUTES_WALLET } from './helpers';
export default {
  path: '/wallet',
  component: TheWalletView,
  props: true,
  children: [
    {
      path: ROUTES_WALLET.Wallets.Path,
      name: ROUTES_WALLET.Wallets.Name,
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.Dashboard.Path,
      name: ROUTES_WALLET.Dashboard.Name,
      component: Dashboard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SendTX.Path,
      name: ROUTES_WALLET.SendTX.Name,
      component: Send,
      props: true,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.NFTManager.Path,
      name: ROUTES_WALLET.NFTManager.Name,
      component: NftManager,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.Swap.Path,
      name: ROUTES_WALLET.Swap.Name,
      component: Swap,
      props: swapProps,
      beforeEnter: swapRouterGuard,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.Dapps.Path,
      component: Dapps,
      children: DappRoutes,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.DeployContract.Path,
      name: ROUTES_WALLET.DeployContract.Name,
      component: DeployContract,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.InteractWithContract.Path,
      name: ROUTES_WALLET.InteractWithContract.Name,
      component: InteractContract,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.SignMessage.Path,
      name: ROUTES_WALLET.SignMessage.Name,
      component: SignMessage,
      meta: {
        noAuth: false
      }
    },
    {
      path: ROUTES_WALLET.VerifyMessage.Path,
      name: ROUTES_WALLET.VerifyMessage.Name,
      component: verifyMessage,
      meta: {
        noAuth: false
      }
    }
  ]
};
