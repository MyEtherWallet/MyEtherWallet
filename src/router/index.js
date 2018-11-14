import Vue from 'vue';
import Router from 'vue-router';

import { routerConfig } from '@/configs';

Vue.use(Router);

export default new Router({
  mode: routerConfig.mode,
  routes: routerConfig.routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    window.scrollTo(0, 0);
  }
});
