import app from './app';
const ExtensionBrowserAction = () => import('@/layouts/ExtensionBrowserAction');
const ExtensionWalletContainer = () =>
  import(
    '@/layouts/ExtensionBrowserAction/containers/ExtensionWalletContainer'
  );
const ExtensionFavoritesContainer = () =>
  import(
    '@/layouts/ExtensionBrowserAction/containers/ExtensionFavoritesContainer'
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
