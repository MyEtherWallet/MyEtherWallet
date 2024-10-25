import { ENS_MANAGER_ROUTE, ensRouterGuard } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
export default {
  title: 'ENS Manager',
  subtitle: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: ENS_MANAGER_ROUTE.ENS_MANAGER.PATH,
  name: ENS_MANAGER_ROUTE.ENS_MANAGER.NAME,
  component: () =>
    import(
      /* webpackChunkName: "dapp-ens" */ '@/dapps/ens-manager-dapp/TheENSManagerLayout'
    ),
  networks: SUPPORTED_NETWORKS,
  layout: () =>
    import(/* webpackChunkName: "dapp-ens" */ './TheENSManagerLayout'),
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
