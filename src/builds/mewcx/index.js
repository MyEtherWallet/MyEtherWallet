import app from './app';
import ExtensionPopup from '@/layouts/ExtensionPopup';
import ExtensionBrowserAction from '@/layouts/ExtensionBrowserAction';
import ExtensionAddWallet from '@/layouts/ExtensionBrowserAction/containers/ExtensionAddWallet';

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
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'Add My Wallet',
        component: ExtensionAddWallet
      }
    ]
  }
];
const configRoutes = routes => {
  return routes.concat(cxRoutes);
};
export { app, configRoutes };
