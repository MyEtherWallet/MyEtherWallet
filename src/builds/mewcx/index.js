import app from './app';
import ExtensionPopup from '@/layouts/ExtensionPopup';
import ExtensionWeb3Popup from '@/layouts/ExtensionWeb3Popup';
import Web3DetectedContainer from '@/layouts/ExtensionWeb3Popup/containers/Web3DetectedContainer';
import AccountAccessContainer from '@/layouts/ExtensionWeb3Popup/containers/AccountAccessContainer';
import SignTxContainer from '@/layouts/ExtensionWeb3Popup/containers/SignTxContainer';
import SignMsgContainer from '@/layouts/ExtensionWeb3Popup/containers/SignMsgContainer';
import ExtensionBrowserAction from '@/layouts/ExtensionBrowserAction';
import ExtensionAddWalletContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionAddWalletContainer';
import ExtensionWalletContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionWalletContainer';
import MyWalletsContainer from '@/layouts/ExtensionBrowserAction/containers/MyWalletsContainer';
import WatchOnlyWalletsContainer from '@/layouts/ExtensionBrowserAction/containers/WatchOnlyWalletsContainer';

const cxRoutes = [
  {
    path: '/extension-popups',
    name: 'Web3 Detected',
    component: ExtensionWeb3Popup,
    meta: { requiresAuth: false },
    children: [
      {
        path: 'web3-detected',
        component: Web3DetectedContainer,
        meta: { requiresAuth: false }
      },
      {
        path: 'account-access',
        component: AccountAccessContainer,
        meta: { requiresAuth: false }
      },
      {
        path: 'sign-tx',
        component: SignTxContainer,
        meta: { requiresAuth: false }
      },
      {
        path: 'sign-msg',
        component: SignMsgContainer,
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
        component: ExtensionWalletContainer,
        meta: { requiresAuth: false },
        children: [
          {
            path: '',
            meta: { requiresAuth: false },
            component: MyWalletsContainer
          },
          {
            path: 'wallets',
            name: 'myWallets',
            meta: { requiresAuth: false },
            component: MyWalletsContainer
          },
          {
            path: 'watch-only',
            name: '',
            meta: { requiresAuth: false },
            component: WatchOnlyWalletsContainer
          }
          // {
          //   path: 'dapps',
          //   name: '',
          //   meta: { requiresAuth: false },
          //   component: DappsContainer
          // }
        ]
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
