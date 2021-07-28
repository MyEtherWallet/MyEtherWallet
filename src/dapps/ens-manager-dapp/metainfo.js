import { ETH, GOERLI, RIN, ROP } from '@/utils/networks/types';
import layout from './TheENSManagerLayout';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  title: 'ENS manager',
  subtitle: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: ROUTES_WALLET.ENS_MANAGER.PATH,
  networks: [ETH, GOERLI, RIN, ROP],
  layout,
  meta: {
    noAuth: false
  }
};
