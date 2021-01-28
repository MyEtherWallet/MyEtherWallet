import Wallets from '@/modules/wallets/Wallets';
import Dashboard from '@/modules/wallets/pages/dashboard/Dashboard';
import Send from '@/modules/wallets/pages/send/send-tx/SendTx';
import SendOffline from '@/modules/wallets/pages/send/send-offline/SendOffline';
import NftManager from '@/modules/wallets/pages/send/nft-manager/NFTManager';
import Swap from '@/modules/wallets/pages/swap/Swap';
import ContractContainer from '@/modules/wallets/pages/contract/ContractContainer';
import InteractContract from '@/modules/wallets/pages/contract/interact-contract/InteractWithContract';
import DeployContract from '@/modules/wallets/pages/contract/deploy-contract/DeployContract';
import SignMessage from '@/modules/message/ModuleSign';
import Dapps from '@/dapps/DappsContainer';
import DappRoutes from '@/dapps/routes.js';

export default {
  path: '/wallet',
  component: Wallets,
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
