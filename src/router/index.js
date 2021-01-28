import Router from 'vue-router';
import store from '@/store';
import langShortCodes from '@/translations/getShortCodes';
import routes from './routes';
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
  if (to.meta.hasOwnProperty('requiresAuth')) {
    next();
  } else {
    if (store.state.wallet.address === null) {
      store.dispatch('global/setLastPath', to.path);
      next({ name: 'AccessWallet' });
    } else {
      if (store.state.global.path !== '') {
        store.dispatch('global/setLastPath', '');
      }
      next();
    }
  }
});

export default router;
