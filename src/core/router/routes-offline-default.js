import { ROUTES_HOME } from '../configs/configRoutes';
import {
  accessWalletProps,
  accessRouteGuard,
  createWalletProps,
  createRouteGuard
} from './helpers';

export default {
  path: '/',
  component: () => import('@/views/TheOfflineDefaultView'),
  props: true,
  children: [
    {
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: () => import('@/views/layouts-default/TheAccessWalletLayout'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: () => import('@/views/layouts-default/TheAccessWalletLayout'),
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      name: ROUTES_HOME.CREATE_WALLET.NAME,
      component: () => import('@/views/layouts-default/TheCreateWalletLayout'),
      props: createWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: createRouteGuard
    }
  ]
};
