import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import VueCompositionAPI from '@vue/composition-api';

import app from './offlineApp';
import '@/assets/fonts/MaterialDesignIcons/css/materialdesignicons.min.css';
import '@/assets/fonts/Roboto/css/Roboto.css';

import './components';

const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
Router.prototype.push = function push(path) {
  return originalPush.call(this, path).catch(err => err);
};
Router.prototype.replace = function push(path) {
  return originalReplace.call(this, path).catch(err => err);
};
Router.prototype.originalPush = originalPush;
Router.prototype.originalReplace = originalReplace;

import router from '@/core/router';
import store from '@/core/store';

import LottieAnimation from '@/core/directives/lottie';
import lokalise from '@/core/filters/lokalise';

// etc
import '@/core/plugins/registerServiceWorker';
import vuetify from '@/core/plugins/vuetify';
import i18n from './i18n';

// Directives
Vue.directive('lottie', LottieAnimation);

// Filters
Vue.filter('lokalise', lokalise);

//Router
Vue.use(Router);

//Store
Vue.use(Vuex);

//Composition
Vue.use(Vuex);

Vue.config.productionTip = false;
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  vuetify,
  render: h => h(app)
});
