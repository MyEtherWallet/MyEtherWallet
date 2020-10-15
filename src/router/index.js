import Router from 'vue-router';
import store from '@/store';
// import { getMode, getRoutes } from '@/builds/configs';
// import { ExtensionHelpers } from '@/helpers';
// import { isAddress } from '@/helpers/addressUtils';
// import { Misc } from '@/helpers';
// import { MEW_CX } from '@/builds/configs/types';
import langShortCodes from '@/translations/getShortCodes';
import routes from './routes';
// const storeQuery = query => {
//   const queryKeys = Object.keys(query);
//   if (queryKeys.length > 0) {
//     const blankObj = {};
//     for (const key in query) {
//       blankObj[key] = Misc.stripTags(query[key]);
//     }

//     store.dispatch('main/saveQueryVal', blankObj);
//   }
// };
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
    if (store.state.main.wallet === null) {
      store.dispatch('setLastPath', to.path);
      next({ name: 'AccessWalletLayout' });
    } else {
      if (store.state.main.path !== '') {
        const localPath = store.state.main.path;
        store.dispatch('setLastPath', '');
        next({ path: localPath });
      } else {
        next();
      }
    }
  }
});

export default router;
