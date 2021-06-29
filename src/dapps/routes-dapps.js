import ENSManager from './ens-manager-dapp/TheENSManagerLayout.vue';
import Aave from './aave-dapp/Aave';
import UnstoppableDomain from './unstoppable-domains/UnstoppableDomain';
import Dapps from '@/modules/dapps-center/ModuleDappsCenter';
import Staked from './staked-dapp/TheStakedLayout';

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
    path: 'aave',
    name: 'Aave',
    component: Aave
  },
  {
    path: 'unstoppable-domain',
    name: 'UnstoppableDomain',
    component: UnstoppableDomain
  },
  {
    path: 'staked',
    name: 'Staked',
    component: Staked
  }
];
