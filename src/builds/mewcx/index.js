import app from './app';
import ExtensionPopup from '@/layouts/ExtensionPopup';
import ExtensionBrowserAction from '@/layouts/ExtensionBrowserAction';

const cxRoutes = [
  {
    path: '/',
    name: 'Popup',
    component: ExtensionPopup,
    meta: { requiresAuth: false }
  },
  {
    path: '/browser-action',
    name: 'BrowserAction',
    component: ExtensionBrowserAction,
    meta: { requiresAuth: false }
  }
];
const configRoutes = routes => {
  return routes.concat(cxRoutes);
};
export { app, configRoutes };
