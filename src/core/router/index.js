import Router from 'vue-router';
import store from '@/core/store';
import langShortCodes from '@/translations/getShortCodes';
import routesDefault from './routes-default';
import routesWallet from './routes-wallet';
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
  // Check if user is coming from a path that needs auth
  if (
    !from.meta.hasOwnProperty('requiresAuth') &&
    to.meta.hasOwnProperty('requiresAuth')
  ) {
    store.dispatch('wallet/removeWallet');
  }
  if (to.meta.hasOwnProperty('requiresAuth')) {
    next();
  } else {
    if (store.state.wallet.address === null) {
      store.dispatch('external/setLastPath', to.path);
      next({ name: 'AccessWallet' });
    } else {
      if (store.state.external.path !== '') {
        store.dispatch('external/setLastPath', '');
      }
      next();
    }
  }
});

export default router;
