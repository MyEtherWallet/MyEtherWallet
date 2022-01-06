import TheDefaultView from '@/views/TheDefaultView';
import TheAccessWalletLayout from '@/views/layouts-default/TheAccessWalletLayout';
import { ROUTES_HOME } from '../configs/configRoutes';
import { accessWalletProps, accessRouteGuard } from './helpers';

export default {
  path: '/',
  component: TheDefaultView,
  props: true,
  children: [
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
