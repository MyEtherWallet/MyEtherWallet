import DappsCenter from './dapps-center';
import Trending from './trending';
import NewDapps from './new-dapps';
import NameManager from './name-manager';
import MakerDAO from './makerdao';
import Aave from './aave';
import Ambrpay from './ambrpay';
import UnstoppableDomain from './unstoppable-domains';

export default [
  {
    path: 'center',
    name: 'DappsCenter',
    component: DappsCenter
  },
  {
    path: 'trending',
    name: 'Trending',
    component: Trending
  },
  {
    path: 'new',
    name: 'NewDapps',
    component: NewDapps
  },
  {
    path: 'name-manager',
    name: 'NameManager',
    component: NameManager
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
