import Router from 'vue-router';
import store from '@/store';
import { getMode, getRoutes } from '@/builds/configs';
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
  if (
    to.hasOwnProperty('meta') &&
    to.meta.hasOwnProperty('requiresAuth') &&
    to.meta.requiresAuth === false
  ) {
    storeQuery(to.query);
    next();
  } else {
    storeQuery(to.query);
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
