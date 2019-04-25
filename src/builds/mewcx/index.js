import app from './app';
import ExtensionPopup from '@/layouts/ExtensionPopup';
import ExtensionBrowserAction from '@/layouts/ExtensionBrowserAction';

const cxRoutes = [
  {
    path: '/popup',
    name: 'Popup',
    component: ExtensionPopup,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: ExtensionBrowserAction,
    meta: { requiresAuth: false }
  }
];
const configRoutes = routes => {
  return routes.concat(cxRoutes);
};
export { app, configRoutes };
