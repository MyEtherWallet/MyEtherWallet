import { ENS_MANAGER_ROUTE, ensRouterGuard } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
const layout = () =>
  import(/* webpackChunkName: "dapp" */ './TheENSManagerLayout');
const ENSManagerLayout = () =>
  import(
    /* webpackChunkName: "dapp" */ '@/dapps/ens-manager-dapp/TheENSManagerLayout'
  );
export default {
  title: 'ENS manager',
  subtitle: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: ENS_MANAGER_ROUTE.ENS_MANAGER.PATH,
  name: ENS_MANAGER_ROUTE.ENS_MANAGER.NAME,
  component: ENSManagerLayout,
  networks: SUPPORTED_NETWORKS,
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
      path: ENS_MANAGER_ROUTE.REVERSE.PATH,
      name: ENS_MANAGER_ROUTE.REVERSE.NAME
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
