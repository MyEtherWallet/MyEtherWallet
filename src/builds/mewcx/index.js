import app from './app';
import AccessWalletLayout from '@/layouts/AccessWalletLayout';

const cxRoutes = [
  {
    path: '/',
    name: 'Home',
    component: AccessWalletLayout,
    meta: { requiresAuth: false }
  },
  {
    path: '/browser-action',
    name: 'BrowserAction',
    component: AccessWalletLayout,
    meta: { requiresAuth: false }
  }
];
const configRoutes = routes => {
  return routes.concat(cxRoutes);
};
export { app, configRoutes };
