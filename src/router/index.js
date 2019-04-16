import Router from 'vue-router';
import store from '@/store';
import { getMode, getRoutes } from '@/builds/configs';
import xss from 'xss';

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
  if (
    to.hasOwnProperty('meta') &&
    to.meta.hasOwnProperty('requiresAuth') &&
    to.meta.requiresAuth === false
  ) {
    next();
  } else {
    const queryKeys = Object.keys(to.query);
    if (queryKeys.length > 0) {
      const blankObj = {};
      for (const key in to.query) {
        blankObj[key] = xss(to.query[key]);
      }

      store.dispatch('saveQueryVal', blankObj);
    }
    if (store.state.wallet === null) {
      store.dispatch('setLastPath', to.path);
      next({ name: 'AccessWalletLayout' });
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
