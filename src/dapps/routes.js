import DappsCenter from './dapps-center/DappsCenter';
import Trending from './trending/Trending';
import NewDapps from './new-dapps/NewDapps';
import NameManager from './name-manager/NameManager';
import MakerDAO from './makerdao/MakerDAO';
import Aave from './aave/Aave';
import Ambrpay from './ambrpay/Ambrpay';
import UnstoppableDomain from './unstoppable-domains/UnstoppableDomain';

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
