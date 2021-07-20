import layout from './UnstoppableDomain';
import { ETH } from '@/utils/networks/types';
export default {
  title: 'Unstoppable Domains',
  subtitle: 'Buy a .crypto domain or manage your .crypto domains',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'stake',
  path: 'unstoppable',
  networks: [ETH],
  layout,
  meta: {
    noAuth: false
  }
};
