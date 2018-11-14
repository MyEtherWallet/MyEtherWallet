import app from './app';
import AccessWalletLayout from '@/layouts/AccessWalletLayout';

const configRoutes = routes => {
  routes.push({
    path: '/browser-action',
    name: 'BrowserAction',
    component: AccessWalletLayout
  });
  return routes;
};
export { app, configRoutes };
