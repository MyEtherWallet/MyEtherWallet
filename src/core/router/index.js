import Router from 'vue-router';
import store from '@/core/store';
import langShortCodes from '@/translations/getShortCodes';
import routesDefault from './routes-default';
import routesOfflineDefault from './routes-offline-default';
import routesOfflineWallet from './routes-offline-wallet';
import routesWallet from './routes-wallet';
import routesNotFound from './routes-not-found';
import { ROUTES_HOME } from '../configs/configRoutes';
const routes =
  // eslint-disable-next-line
  BUILD === 'offline'
    ? [routesOfflineDefault, routesOfflineWallet, routesNotFound]
    : [routesDefault, routesWallet, routesNotFound];

const getLangBasePath = () => {
  if (ROUTER_MODE === 'hash') return undefined;
  const locale = window.location.pathname.replace(/^\/([^/]+).*/i, '$1').trim();
  if (Object.keys(langShortCodes).includes(locale)) return '/' + locale;
  return undefined;
};
const router = new Router({
  base: getLangBasePath(),
  mode: ROUTER_MODE || 'hash',
  routes: routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    window.scrollTo(0, 0);
  }
});
router.beforeResolve((to, from, next) => {
  // Check if user is coming from a path that needs auth
  if (!from.meta.noAuth && store.state.wallet.address && to.meta.noAuth) {
    store.dispatch('wallet/removeWallet');
  }
  if (to.meta.noAuth) {
    next();
  } else {
    if (store.state.wallet.address === null) {
      store.dispatch('external/setLastPath', to.path);
      next({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
    } else {
      if (store.state.external.path !== '') {
        const localPath = store.state.external.path;
        store.dispatch('external/setLastPath', '');
        router.push({ path: localPath });
      } else {
        next();
      }
    }
  }
});

export default router;
