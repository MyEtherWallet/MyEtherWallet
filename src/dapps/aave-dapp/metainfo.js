import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import layout from './Aave';
export default {
  title: 'Aave V1',
  subtitle: 'Earn passive income on your deposits and borrow assets',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'aave',
  name: ROUTES_WALLET.AAVE.NAME,
  path: ROUTES_WALLET.AAVE.PATH,
  networks: [],
  layout,
  meta: {
    noAuth: false
  }
};
