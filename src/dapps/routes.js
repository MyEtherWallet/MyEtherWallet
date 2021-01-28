import DappsCenter from './dapps-center/DappsCenter';
import ENSManager from './EnsManagerDapp/TheENSManagerLayout.vue';
import MakerDAO from './makerdao/MakerDAO';
import Aave from './AaveDapp/Aave';
import Ambrpay from './AmbrpayDapp/Ambrpay';
import UnstoppableDomain from './unstoppable-domains/UnstoppableDomain';

export default [
  {
    path: 'center',
    name: 'DappsCenter',
    component: DappsCenter
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
