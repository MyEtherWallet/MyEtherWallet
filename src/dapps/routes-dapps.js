import ENSManager from './ens-manager-dapp/TheENSManagerLayout.vue';
import MakerDAO from './makerdao/MakerDAO';
import Aave from './aave-dapp/Aave';
import Ambrpay from './ambrpay-dapp/TheAmbrpayLayout';
import UnstoppableDomain from './unstoppable-domains/UnstoppableDomain';
import Dapps from '@/modules/dapps-center/ModuleDappsCenter';

export default [
  {
    path: '',
    name: 'Dapps',
    component: Dapps
  },
  {
    path: 'ens-manager',
    name: 'ENSManager',
    component: ENSManager
  },
  {
    path: 'maker-dao',
    name: 'MakerDAO',
    component: MakerDAO
  },
  {
    path: 'aave',
    name: 'Aave',
    component: Aave
  },
  {
    path: 'ambrpay',
    name: 'Ambrpay',
    component: Ambrpay
  },
  {
    path: 'unstoppable-domain',
    name: 'UnstoppableDomain',
    component: UnstoppableDomain
  }
];
