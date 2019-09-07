import HomeLayout from '@/layouts/HomeLayout';
import CreateWalletLayout from '@/layouts/CreateWalletLayout';

import app from './app';
const webRoutes = [
  {
    path: '/',
    name: 'Home',
    component: HomeLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/create-wallet',
    name: 'CreateWalletLayout',
    component: CreateWalletLayout,
    meta: { requiresAuth: false }
  }
];
const configRoutes = routes => {
  return routes.concat(webRoutes);
};
export { app, configRoutes };
