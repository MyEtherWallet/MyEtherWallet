import Router from 'vue-router';
import store from '@/core/store';
import langShortCodes from '@/translations/getShortCodes';
import routesDefault from './routes-default';
import routesWallet from './routes-wallet';
// const storeQuery = query => {
//   const queryKeys = Object.keys(query);
//   if (queryKeys.length > 0) {
//     const blankObj = {};
//     for (const key in query) {
//       blankObj[key] = Misc.stripTags(query[key]);
//     }

//     store.dispatch(/saveQueryVal', blankObj);
//   }
// };
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
  // storeQuery(to.query);
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
