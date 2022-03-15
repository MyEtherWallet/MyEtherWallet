import { ENS_MANAGER_ROUTE, ensRouterGuard } from './configsRoutes';
import { ETH, GOERLI, RIN, ROP } from '@/utils/networks/types';
import layout from './TheENSManagerLayout';
import ENSManagerLayout from '@/dapps/ens-manager-dapp/TheENSManagerLayout';
export default {
  title: 'ENS manager',
  subtitle: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: ENS_MANAGER_ROUTE.ENS_MANAGER.PATH,
  name: ENS_MANAGER_ROUTE.ENS_MANAGER.NAME,
  component: ENSManagerLayout,
  networks: [ETH, GOERLI, RIN, ROP],
  layout,
  release: '07/08/2021',
  meta: {
    noAuth: false
  },
  children: [
    {
      path: ENS_MANAGER_ROUTE.MANAGE.PATH,
      name: ENS_MANAGER_ROUTE.MANAGE.NAME
    },
    {
      path: ENS_MANAGER_ROUTE.CLAIM.PATH,
      name: ENS_MANAGER_ROUTE.CLAIM.NAME
    },
    {
      path: ENS_MANAGER_ROUTE.ENS_1.PATH,
      name: ENS_MANAGER_ROUTE.ENS_1.NAME,
      beforeEnter: ensRouterGuard
    },
    {
      path: ENS_MANAGER_ROUTE.ENS_2.PATH,
      name: ENS_MANAGER_ROUTE.ENS_2.NAME,
      beforeEnter: ensRouterGuard
    },
    {
      path: ENS_MANAGER_ROUTE.ENS_3.PATH,
      name: ENS_MANAGER_ROUTE.ENS_3.NAME,
      beforeEnter: ensRouterGuard
    }
  ]
};
