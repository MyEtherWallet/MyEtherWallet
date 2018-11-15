import app from './app';
import AccessWalletLayout from '@/layouts/AccessWalletLayout';

const cxRoutes = [
  {
    path: '/',
    name: 'Home',
    component: AccessWalletLayout
  },
  {
    path: '/browser-action',
    name: 'BrowserAction',
    component: AccessWalletLayout
  }
];
const configRoutes = routes => {
  return routes.concat(cxRoutes);
};
export { app, configRoutes };
