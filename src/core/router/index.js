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
  if (!from.meta.noAuth && store.state.wallet.address && to.meta.noAuth) {
    store.dispatch('wallet/removeWallet');
  }
  if (to.meta.noAuth) {
    next();
  } else {
    if (store.state.wallet.address === null) {
      store.dispatch('external/setLastPath', to.path);
      /** only resolve a new path when current path isn't accesswallet
       * this is a little hacky but utilizes intended purpose.
       * vue router notes: move on to the next hook in the pipeline. If no hooks are left, the navigation is confirmed.
       */
      router.push({ name: 'AccessWallet' });
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
