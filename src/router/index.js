import Router from 'vue-router';
import store from '@/store';
import { getMode, getRoutes } from '@/builds/configs';
import { ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
import Misc from '@/helpers/misc';
import { MEW_CX } from '@/builds/configs/types';
import locStore from 'store';

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

router.beforeEach((to, _, next) => {
  const getCurrentLangCode = locStore.get('locale') || 'en_US';
  if (BUILD_TYPE !== MEW_CX) {
    if (to.path === '/') {
      const newPath = {
        path: `${to.path}${getCurrentLangCode.substr(0, 2)}`,
        replace: true
      };
      return next(newPath);
    } else if (!to.path.includes('en') && !to.path.includes('ru')) {
      const newPath = {
        path: `/${getCurrentLangCode.substr(0, 2)}${to.path}`,
        replace: true
      };
      return next(newPath);
    } else if (to.path.includes('en') || to.path.includes('ru') {

    })
    store.dispatch('setLocale', getCurrentLangCode);
    return next();
  }

  return next();
});

router.beforeResolve((to, from, next) => {
  storeQuery(to.query);
  if (to.meta.hasOwnProperty('requiresAuth')) {
    next();
  } else {
    if (store.state.wallet === null) {
      if (BUILD_TYPE === MEW_CX) {
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
