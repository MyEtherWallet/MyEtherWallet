const TheWalletView = () =>
  import(/* webpackChunkName: "wallet" */ '@/views/TheWalletView');
const Dashboard = () =>
  import(
    /* webpackChunkName: "wallet" */ '@/views/layouts-wallet/TheDashboardLayout'
  );
const Send = () =>
  import(
    /* webpackChunkName: "wallet" */ '@/views/layouts-wallet/TheSendTransactionLayout'
  );
const SendOffline = () =>
  import(
    /* webpackChunkName: "wallet-offline" */ '@/views/layouts-wallet/TheSendTransactionOfflineLayout'
  );
const NftManager = () =>
  import(
    /* webpackChunkName: "nft" */ '@/views/layouts-wallet/TheNFTManagerLayout'
  );
const Swap = () =>
  import(
    /* webpackChunkName: "wallet" */ '@/views/layouts-wallet/TheSwapLayout'
  );
const InteractContract = () =>
  import(
    /* webpackChunkName: "contract" */ '@/views/layouts-wallet/TheInteractContractLayout'
  );
const DeployContract = () =>
  import(
    /* webpackChunkName: "contract" */ '@/views/layouts-wallet/TheDeployContractLayout'
  );
const SignMessage = () =>
  import(
    /* webpackChunkName: "contract" */ '@/views/layouts-wallet/TheSignMessageLayout'
  );
const VerifyMessage = () =>
  import(
    /* webpackChunkName: "contract" */ '@/views/layouts-wallet/TheVerifyMessageLayout'
  );
const Dapps = () =>
  import(
    /* webpackChunkName: "dapps" */ '@/views/layouts-wallet/TheDappCenterLayout.vue'
  );
import DappRoutes from '@/dapps/routes-dapps.js';
const Settings = () =>
  import(/* webpackChunkName: "wallet" */ '@/modules/settings/ModuleSettings');
const NftManagerSend = () =>
  import(
    /* webpackChunkName: "nft" */ '@/modules/nft-manager/components/NftManagerSend'
  );
const Network = () =>
  import(/* webpackChunkName: "wallet" */ '@/modules/network/ModuleNetwork');
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
      path: ROUTES_WALLET.SEND_TX_OFFLINE.PATH,
      name: ROUTES_WALLET.SEND_TX_OFFLINE.NAME,
      component: SendOffline,
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
      path: ROUTES_WALLET.NETWORK.PATH,
      name: ROUTES_WALLET.NETWORK.NAME,
      component: Network,
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
