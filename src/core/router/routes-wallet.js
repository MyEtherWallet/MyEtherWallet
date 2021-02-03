import TheWalletView from '@/views/TheWalletView';
import Dashboard from '@/views/layouts-wallet/TheDashboardLayout';
import Send from '@/views/layouts-wallet/TheSendTransactionLayout';
// import SendOffline from '@/modules/wallets/pages/send/send-offline/SendOffline';
import NftManager from '@/views/layouts-wallet/TheNFTManagerLayout';
import Swap from '@/views/layouts-wallet/TheSwapLayout';
import InteractContract from '@/views/layouts-wallet/TheInteractContractLayout';
import DeployContract from '@/views/layouts-wallet/TheDeployContractLayout';
import SignMessage from '@/views/layouts-wallet/TheSignMessageLayout';
import Dapps from '@/views/layouts-wallet/TheDappCenterLayout.vue';
import DappRoutes from '@/dapps/routes-dapps.js';

export default {
  path: '/wallet',
  component: TheWalletView,
  props: true,
  children: [
    {
      path: '',
      name: 'Wallets',
      component: Dashboard
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: 'send-tx',
      name: 'SendTX',
      component: Send,
      props: true
    },
    // {
    //   path: 'offline',
    //   name: 'SendOffline',
    //   component: SendOffline
    // },
    {
      path: 'nft',
      name: 'NFTManager',
      component: NftManager
    },
    {
      path: 'swap',
      name: 'Swap',
      component: Swap
    },
    {
      path: 'dapps',
      name: 'Dapps',
      component: Dapps,
      children: DappRoutes
    },
    {
      path: 'deploy',
      name: 'DeployContract',
      component: DeployContract
    },
    {
      path: 'interact',
      name: 'InteractWithContract',
      component: InteractContract
    },
    {
      path: 'sign',
      name: 'SignMessage',
      component: SignMessage
    }
  ]
};
