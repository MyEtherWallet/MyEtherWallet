import app from './app';
import ExtensionBrowserAction from '@/layouts/ExtensionBrowserAction';
// import ExtensionAddWalletContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionAddWalletContainer';
import ExtensionWalletContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionWalletContainer';
// import MyWalletsContainer from '@/layouts/ExtensionBrowserAction/containers/MyWalletsContainer';
// import WatchOnlyWalletsContainer from '@/layouts/ExtensionBrowserAction/containers/WatchOnlyWalletsContainer';
import ViewWalletInfoLayout from '@/layouts/ViewWalletInfoLayout';
import ExtensionDappsContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionDappsContainer';
import ExtensionDappsItemContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionDappsItemContainer';
import ExtensionDappContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionDappContainer';

const cxRoutes = [
  {
    path: '/',
    component: ExtensionBrowserAction,
    children: [
      {
        path: '',
        component: ExtensionWalletContainer,
        meta: { requiresAuth: false }
        // children: [
        //   {
        //     path: '',
        //     meta: { requiresAuth: false },
        //     component: MyWalletsContainer
        //   },
        //   {
        //     path: 'wallets',
        //     name: 'myWallets',
        //     meta: { requiresAuth: false },
        //     component: MyWalletsContainer
        //   },
        //   {
        //     path: 'watch-only',
        //     name: '',
        //     meta: { requiresAuth: false },
        //     component: WatchOnlyWalletsContainer
        //   }
        // ]
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
      // {
      //   path: '/access-my-wallet',
      //   name: 'AccessWalletLayout',
      //   component: ExtensionAddWalletContainer,
      //   meta: { requiresAuth: false }
      // }
    ]
  },
  {
    path: '/view-wallet-info',
    name: 'ViewWalletInfoLayout',
    component: ViewWalletInfoLayout
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
