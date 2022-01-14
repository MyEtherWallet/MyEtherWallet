import { ENS_ROUTE } from './configsRoutes';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';

import layout from './TheENSManagerLayout';
import { ensRouterGuard } from '@/core/router/helpers';
import ModuleRegisterDomain from './modules/ModuleRegisterDomain';
import ModuleManageDomain from './modules/ModuleManageDomain';
import ModuleClaim from './modules/ModuleClaim';
export default {
  title: 'ENS manager',
  subtitle: 'Migrate or register ENS domain / subdomain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'ensManager',
  path: ENS_ROUTE.CORE.PATH,
  defaultName: ENS_ROUTE.CORE.NAME,
  networks: SUPPORTED_NETWORKS,
  layout,
  meta: {
    noAuth: false
  },
  children: [
    {
      name: ENS_ROUTE.CORE.NAME,
      path: '', //selected tab by default
      component: ModuleRegisterDomain
      // beforeEnter: ensRouterGuard
    },
    {
      name: ENS_ROUTE.MANAGE.NAME,
      path: ENS_ROUTE.MANAGE.PATH,
      component: ModuleManageDomain
      // beforeEnter: ensRouterGuard
    },
    {
      name: ENS_ROUTE.CLAIM.NAME,
      path: ENS_ROUTE.CLAIM.PATH,
      component: ModuleClaim
      // beforeEnter: ensRouterGuard
    }
    // {
    //   path: ROUTES_WALLET.ENS_2.PATH,
    //   name: ROUTES_WALLET.ENS_2.NAME,
    //   beforeEnter: ensRouterGuard
    // },
    // {
    //   path: ROUTES_WALLET.ENS_3.PATH,
    //   name: ROUTES_WALLET.ENS_3.NAME,
    //   beforeEnter: ensRouterGuard
    // }
  ]
};
