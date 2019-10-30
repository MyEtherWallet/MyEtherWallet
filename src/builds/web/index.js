const HomeLayout = () => import('@/layouts/HomeLayout');
const CreateWalletLayout = () => import('@/layouts/CreateWalletLayout');
const AccessWalletLayout = () => import('@/layouts/AccessWalletLayout');

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
  },
  {
    path: '/access-my-wallet',
    name: 'AccessWalletLayout',
    component: AccessWalletLayout,
    meta: { requiresAuth: false }
  }
];
const configRoutes = routes => {
  return routes.concat(webRoutes);
};
export { app, configRoutes };
