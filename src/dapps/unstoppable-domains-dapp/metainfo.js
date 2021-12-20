import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import layout from './UnstoppableDomain';
import { ETH } from '@/utils/networks/types';
export default {
  title: 'Unstoppable Domains',
  subtitle: 'Buy a .crypto domain or manage your .crypto domains',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'stake',
  name: ROUTES_WALLET.UNSTOPPABLE.NAME,
  path: ROUTES_WALLET.UNSTOPPABLE.PATH,
  networks: [ETH],
  layout,
  release: '07/09/2021', // placeholder
  meta: {
    noAuth: false
  }
};
