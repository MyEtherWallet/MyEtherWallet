import layout from './TheRNSManagerLayout.vue';
import Module1 from './modules/ModuleRegisterDomain';
import { ROOTSTOCK } from '@/utils/networks/types';
import { RNS_MANAGER_ROUTE, rnsRouterGuard } from './routes';

export default {
  title: 'RNS Manager',
  subtitle: 'Register RNS domain',
  tag: '#Property',
  rightIconType: 'mew',
  rightIcon: 'rns',
  path: RNS_MANAGER_ROUTE.RNS_MANAGER.PATH,
  name: RNS_MANAGER_ROUTE.RNS_MANAGER.NAME,
  defaultName: RNS_MANAGER_ROUTE.RNS_MANAGER.NAME,
  networks: [ROOTSTOCK],
  isNew: true,
  layout,
  meta: {
    noAuth: false
  },
  children: [
    {
      path: RNS_MANAGER_ROUTE.MANAGE.PATH,
      name: RNS_MANAGER_ROUTE.MANAGE.NAME,
      component: Module1
    },
    {
      path: RNS_MANAGER_ROUTE.RNS_1.PATH,
      name: RNS_MANAGER_ROUTE.RNS_1.NAME,
      beforeEnter: rnsRouterGuard
    }
  ]
};
