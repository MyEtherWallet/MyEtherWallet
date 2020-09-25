import Wallets from './Wallets';
import Dashboard from './pages/dashboard/Dashboard';
import Send from './pages/send/send-tx/SendTx';
import SendOffline from './pages/send/send-offline/SendOffline';
import NftManager from './pages/send/nft-manager/NFTManager';
import Swap from './pages/swap/Swap';
import ContractContainer from './pages/contract/ContractContainer';
import InteractContract from './pages/contract/interact-contract/InteractWithContract';
import DeployContract from './pages/contract/deploy-contract/DeployContract';
import SignMessage from './pages/sign-message/SignMessage';
import Dapps from '@/dapps/DappsContainer';
import DappRoutes from '@/dapps/routes.js';

export default {
  path: '/wallet',
  name: 'Wallet',
  component: Wallets,
  props: { default: true, sidebar: false },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'send-tx',
      name: 'SendTX',
      component: Send,
      props: { default: true, sidebar: false },
      meta: {
        requiresAuth: false
      }
    },
    {
      path: 'offline',
      name: 'SendOffline',
      component: SendOffline
    },
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
      path: 'contract',
      name: 'Contract',
      component: ContractContainer,
      children: [
        {
          path: 'deploy',
          name: 'DeployContract',
          component: DeployContract
        },
        {
          path: 'interact',
          name: 'InteractWithContract',
          component: InteractContract
        }
      ]
    },
    {
      path: 'sign',
      name: 'SignMessage',
      component: SignMessage
    }
  ]
};
