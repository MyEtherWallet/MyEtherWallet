import app from './app';
import ExtensionPopup from '@/layouts/ExtensionPopup';
import ExtensionWeb3Layout from '@/layouts/ExtensionWeb3Layout';
import Web3Detected from '@/layouts/ExtensionWeb3Layout/containers/Web3Detected';
import ExtensionBrowserAction from '@/layouts/ExtensionBrowserAction';
import ExtensionAddWalletContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionAddWalletContainer';
import ExtensionWalletContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionWalletContainer';

const cxRoutes = [
  {
    path: '/extension-popups',
    name: 'Web3 Detected',
    component: ExtensionWeb3Layout,
    meta: { requiresAuth: false },
    children: [
      {
        path: 'web3-detected',
        component: Web3Detected,
        meta: { requiresAuth: false }
      },
      {
        path: 'account-access',
        meta: { requiresAuth: false }
      },
      {
        path: 'sign-tx',
        meta: { requiresAuth: false }
      },
      {
        path: 'sign-msg',
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/popup',
    name: 'Popup',
    component: ExtensionPopup,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: ExtensionBrowserAction,
    children: [
      {
        path: '',
        name: 'View Wallets',
        component: ExtensionWalletContainer,
        meta: { requiresAuth: false }
      },
      {
        path: '/access-my-wallet',
        name: 'AccessWalletLayout',
        component: ExtensionAddWalletContainer,
        meta: { requiresAuth: false }
      }
    ]
  }
];
const configRoutes = routes => {
  return routes.concat(cxRoutes);
};
export { app, configRoutes };
