import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { ETH, GOERLI, RIN, ROP } from '@/utils/networks/types';
import layout from './TheENSManagerLayout';
import ENSManagerLayout from '@/dapps/ens-manager-dapp/TheENSManagerLayout';
export default {
  title: 'ENS manager',
  subtitle: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: ROUTES_WALLET.ENS_MANAGER.PATH,
  name: ROUTES_WALLET.ENS_MANAGER.NAME,
  component: ENSManagerLayout,
  networks: [ETH, GOERLI, RIN, ROP],
  layout,
  meta: {
    noAuth: false
  },
  children: [
    {
      path: '',
      name: ROUTES_WALLET.ENS.NAME,
      component: ENSManagerLayout
    }
  ]
};
