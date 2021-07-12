import { ETH } from '@/utils/networks/types';
import layout from './TheAaveLayout';
export default {
  title: 'Aave V1',
  subtitle: 'Earn passive income on your deposits and borrow assets',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'aave',
  path: 'aave',
  networks: [ETH],
  layout,
  meta: {
    noAuth: false
  }
};
