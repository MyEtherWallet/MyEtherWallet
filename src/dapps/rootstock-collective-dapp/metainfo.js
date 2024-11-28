import layout from './TheRootstockCollectiveLayout.vue';
import Module1 from './modules/ModuleRootstockCollective.vue';
import { SUPPORTED_NETWORKS } from './handlers/helpers/supportedNetworks';
import {
  ROOTSTOCK_COLLECTIVE_ROUTE,
  rootstockCollectiveRouterGuard
} from './routes';

export default {
  title: 'Rootstock Collective',
  subtitle: '',
  description: 'Empowering Bitcoin Builders',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'rsk-collective',
  path: ROOTSTOCK_COLLECTIVE_ROUTE.MYCOLLECTIVE.PATH,
  name: ROOTSTOCK_COLLECTIVE_ROUTE.MYCOLLECTIVE.NAME,
  defaultName: ROOTSTOCK_COLLECTIVE_ROUTE.MYCOLLECTIVE.NAME,
  networks: SUPPORTED_NETWORKS,
  layout,
  release: '01/01/2025', // TBD with MEW
  meta: {
    noAuth: false
  },
  children: [
    {
      path: ROOTSTOCK_COLLECTIVE_ROUTE.MYCOLLECTIVE.PATH,
      name: ROOTSTOCK_COLLECTIVE_ROUTE.MYCOLLECTIVE.NAME,
      component: Module1
    },
    {
      path: ROOTSTOCK_COLLECTIVE_ROUTE.PROPOSALS.PATH,
      name: ROOTSTOCK_COLLECTIVE_ROUTE.PROPOSALS.NAME,
      beforeEnter: rootstockCollectiveRouterGuard
    }
  ]
};
