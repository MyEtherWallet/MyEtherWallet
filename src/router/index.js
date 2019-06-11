import Router from 'vue-router';
import store from '@/store';
import { getMode, getRoutes } from '@/builds/configs';
import { ExtensionHelpers } from '@/helpers';
import xss from 'xss';

const storeQuery = query => {
  const keys = Object.keys(query);
  if (keys.length > 0) {
    const blankObj = {};
    for (const key in query) {
      blankObj[key] = xss(query[key]);
    }

    store.dispatch('saveQueryVal', blankObj);
  }
};

const router = new Router({
  mode: getMode(),
  routes: getRoutes(),
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    window.scrollTo(0, 0);
  }
});

router.beforeResolve((to, ___, next) => {
  storeQuery(to.query);
  if (
    to.hasOwnProperty('meta') &&
    to.meta.hasOwnProperty('requiresAuth') &&
    to.meta.requiresAuth === false
  ) {
    next();
  } else {
    if (store.state.wallet === null) {
      if (BUILD_TYPE === 'mewcx') {
        ExtensionHelpers.getAccounts(item => {
          const hasStoredWallet = Object.keys(item).length > 0;
          if (hasStoredWallet) {
            next('/');
          } else {
            next({ name: 'AccessWalletLayout' });
          }
        });
      } else {
        store.dispatch('setLastPath', to.path);
        next({ name: 'AccessWalletLayout' });
      }
    } else {
      if (store.state.path !== '') {
        const localPath = store.state.path;
        store.dispatch('setLastPath', '');
        next({ path: localPath });
      } else {
        next();
      }
    }
  }
});

export default router;
