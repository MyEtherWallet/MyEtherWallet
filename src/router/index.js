import Vue from 'vue';
import Router from 'vue-router';

import { getMode, getRoutes } from '@/builds/configs';

Vue.use(Router);

export default new Router({
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
