import Router from 'vue-router';
import store from '@/core/store';
import langShortCodes from '@/translations/getShortCodes';
import routesDefault from './routes-default';
import routesWallet from './routes-wallet';
import { ROUTES_HOME } from '../configs/configRoutes';
const routes = [routesDefault, routesWallet];

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
  // If route point doesn't exist, re-route to 404 page
  if (to.name === null) {
    next({ name: ROUTES_HOME.PAGE_NOT_FOUND.NAME });
    return;
  }
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
