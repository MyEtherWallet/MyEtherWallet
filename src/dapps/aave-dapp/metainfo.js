import { ETH } from '@/utils/networks/types';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import layout from './TheAaveLayout';
export default {
  title: 'Aave V2',
  subtitle: 'Earn on your deposits and borrow assets',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'aave',
  name: ROUTES_WALLET.AAVE.NAME,
  path: ROUTES_WALLET.AAVE.PATH,
  networks: [ETH],
  layout,
  release: '09/01/2022',
  meta: {
    noAuth: false
  }
};
