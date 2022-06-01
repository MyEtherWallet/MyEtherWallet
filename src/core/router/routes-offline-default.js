import TheOfflineDefaultView from '@/views/TheOfflineDefaultView';
import TheAccessWalletLayout from '@/views/layouts-default/TheAccessWalletLayout';
import { ROUTES_HOME } from '../configs/configRoutes';
import { accessWalletProps, accessRouteGuard } from './helpers';

export default {
  path: '/',
  component: TheOfflineDefaultView,
  props: true,
  children: [
    {
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: TheAccessWalletLayout,
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: TheAccessWalletLayout,
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    }
  ]
};
