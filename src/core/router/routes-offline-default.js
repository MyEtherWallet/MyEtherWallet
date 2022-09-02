const TheOfflineDefaultView = () => import('@/views/TheOfflineDefaultView');
const TheAccessWalletLayout = () =>
  import('@/views/layouts-default/TheAccessWalletLayout');
const TheCreateWalletLayout = () =>
  import('@/views/layouts-default/TheCreateWalletLayout');
import { ROUTES_HOME } from '../configs/configRoutes';
import {
  accessWalletProps,
  accessRouteGuard,
  createWalletProps,
  createRouteGuard
} from './helpers';

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
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      name: ROUTES_HOME.CREATE_WALLET.NAME,
      component: TheCreateWalletLayout,
      props: createWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: createRouteGuard
    }
  ]
};
