import app from './app';
const ExtensionPopup = () => import('@/layouts/ExtensionPopup');
const ExtensionWeb3Popup = () => import('@/layouts/ExtensionWeb3Popup');
const Web3DetectedContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/Web3DetectedContainer');
const AccountAccessContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/AccountAccessContainer');
const SignTxContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/SignTxContainer');
const SignMsgContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/SignMsgContainer');
const ExtensionBrowserAction = () => import('@/layouts/ExtensionBrowserAction');
const ExtensionAddWalletContainer = () =>
  import(
    '@/layouts/ExtensionBrowserAction/containers/ExtensionAddWalletContainer'
  );
const ExtensionWalletContainer = () =>
  import(
    '@/layouts/ExtensionBrowserAction/containers/ExtensionWalletContainer'
  );
const MyWalletsContainer = () =>
  import('@/layouts/ExtensionBrowserAction/containers/MyWalletsContainer');
const WatchOnlyWalletsContainer = () =>
  import(
    '@/layouts/ExtensionBrowserAction/containers/WatchOnlyWalletsContainer'
  );

const ExtensionDappsContainer = () =>
  import('@/layouts/ExtensionBrowserAction/containers/ExtensionDappsContainer');
const ExtensionDappsItemContainer = () =>
  import(
    '@/layouts/ExtensionBrowserAction/containers/ExtensionDappsItemContainer'
  );
const ExtensionDappContainer = () =>
  import('@/layouts/ExtensionBrowserAction/containers/ExtensionDappContainer');

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
          },
          {
            path: 'dapps',
            meta: { requiresAuth: false },
            component: ExtensionDappsContainer,
            children: [
              {
                path: '',
                meta: { requiresAuth: false },
                component: ExtensionDappsItemContainer
              },
              {
                path: '/dapps/:slug',
                meta: { requiresAuth: false },
                component: ExtensionDappContainer
              }
            ]
          }
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
  const interfaceIdx = routes.findIndex(item => {
    return item.path === '/interface';
  });
  const newArr = [];
  routes[interfaceIdx].children.forEach(item => {
    if (item.path !== 'send-offline') {
      newArr.push(item);
    }
  });

  routes[interfaceIdx].children = newArr;
  return routes.concat(cxRoutes);
};

export { app, configRoutes };
