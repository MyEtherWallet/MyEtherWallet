import DappsCenter from './DappsCenter';
import Trending from './Trending';
import NewDapps from './NewDapps';
import NameManager from './NameManager';
import MakerDAO from './MakerDAO';
import Aave from './Aave';
import Ambrpay from './Ambrpay';
import UnstoppableDomain from './UnstoppableDomain';

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
