import app from './app';
import ExtensionBrowserAction from '@/layouts/ExtensionBrowserAction';
import ExtensionWalletContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionWalletContainer';
import ExtensionFavoritesContainer from '@/layouts/ExtensionBrowserAction/containers/ExtensionFavoritesContainer';
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
      },
      {
        path: 'favorites',
        component: ExtensionFavoritesContainer,
        meta: { requiresAuth: false }
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
