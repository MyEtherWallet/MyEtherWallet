import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

import { getMode, getRoutes } from '@/builds/configs';

Vue.use(Router);

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
  if (to.meta.requiresAuth) {
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
  } else {
    next();
  }
});

export default router;
