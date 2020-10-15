import Router from 'vue-router';
import store from '@/store';
import routes from './routes';

const router = new Router({
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
      store.dispatch('saveQueryVal', blankObj);
    }
    if (store.state.wallet === null) {
      console.log('WHERE?????', store.state.wallet);
      store.dispatch('setLastPath', to.path);
      next({ name: 'AccessWallet' });
    } else {
      console.log('WHERE????? 1', store.state.wallet);
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
