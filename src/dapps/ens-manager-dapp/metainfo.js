import { ETH, GOERLI, RIN, ROP } from '@/utils/networks/types';
import layout from './TheENSManagerLayout';
export default {
  title: 'ENS manager',
  subtitle: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: 'ens-manager',
  networks: [ETH, GOERLI, RIN, ROP],
  layout,
  meta: {
    noAuth: false
  }
};
