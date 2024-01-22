import layout from './TheFlyoverLayout.vue';
import Module1 from './modules/ModulePegin.vue';
import { ROOTSTOCK } from '@/utils/networks/types';
import { FLYOVER_ROUTE, flyoverRouterGuard } from './routes';

export default {
  title: 'Flyover',
  subtitle:
    'Transfer BTC from Bitcoin directly to Rootstock or RBTC to Bitcoin faster',
  tag: '#DeFi',
  rightIconType: 'mew',
  rightIcon: 'flyover',
  path: FLYOVER_ROUTE.FLYOVER.PATH,
  name: FLYOVER_ROUTE.FLYOVER.NAME,
  defaultName: FLYOVER_ROUTE.FLYOVER.NAME,
  networks: [ROOTSTOCK],
  isNew: true,
  layout,
  release: '01/22/2024',
  meta: {
    noAuth: false
  },
  children: [
    {
      path: FLYOVER_ROUTE.PEGIN.PATH,
      name: FLYOVER_ROUTE.PEGIN.NAME,
      component: Module1
    },
    {
      path: FLYOVER_ROUTE.PEGOUT.PATH,
      name: FLYOVER_ROUTE.PEGOUT.NAME,
      beforeEnter: flyoverRouterGuard
    }
  ]
};
