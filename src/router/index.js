import Router from 'vue-router';
import store from '@/store';
import { getMode, getRoutes } from '@/builds/configs';
import { ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
import Misc from '@/helpers/misc';

const storeQuery = query => {
  const queryKeys = Object.keys(query);
  if (queryKeys.length > 0) {
    const blankObj = {};
    for (const key in query) {
      blankObj[key] = Misc.stripTags(query[key]);
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

router.beforeResolve((to, from, next) => {
  storeQuery(to.query);
  if (to.meta.hasOwnProperty('requiresAuth')) {
    next();
  } else {
    if (store.state.wallet === null) {
      if (BUILD_TYPE === 'mewcx') {
        ExtensionHelpers.getAccounts(item => {
          const hasStoredWallet = Object.keys(item).filter(key => {
            const newObj = {};
            if (isAddress(key)) {
              return (newObj[key] = item[key]);
            }
          });
          if (hasStoredWallet.length > 0) {
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
