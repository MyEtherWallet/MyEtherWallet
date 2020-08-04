import Wallets from './Wallets';
import Dashboard from './pages/dashboard';
import Send from './pages/send-tx';
import SendOffline from './pages/send-offline';
import NftManager from './pages/nft-manager';
import Swap from './pages/swap';
import InteractContract from './pages/interact-contract';
import DeployContract from './pages/deploy-contract';
import SignMessage from './pages/sign-message';
import Dapps from '@/dapps/DappsContainer';
import DappRoutes from '@/dapps/routes.js';

export default {
  path: '/wallet',
  name: 'Wallet',
  component: Wallets,
  meta: {
    requiresAuth: false
  },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: 'send',
      name: 'Send',
      component: Send,
      children: [
        {
          path: '',
          name: 'SendTX',
          component: Send
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
        }
      ]
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
