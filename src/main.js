import app from './app';
import '@/assets/fonts/MaterialDesignIcons/css/materialdesignicons.min.css';
import '@/assets/fonts/Roboto/css/Roboto.css';

import './main/sentry';
import './main/components';
import './main/matomo';

import Vue from 'vue';
import Router from 'vue-router';
import { v4 as uuidv4 } from 'uuid';

import VueIntercom from '@mathieustan/vue-intercom';

/**Dapps Store */
import { dappStoreBeforeCreate } from './dapps/dappsStore';

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
import Vuex from 'vuex';

import LottieAnimation from '@/core/directives/lottie';
import lokalise from './core/filters/lokalise';

// etc
import '@/core/plugins/registerServiceWorker';
import vuetify from '@/core/plugins/vuetify';
import apolloProvider from './main/apolloProvider';
import i18n from './main/i18n';
import * as locStore from 'store';

// Directives
Vue.directive('lottie', LottieAnimation);

// Filters
Vue.filter('lokalise', lokalise);

// eslint-disable-next-line
Vue.use(VueIntercom, { appId: 'ja20qe25' });

//Router
Vue.use(Router);
Vue.use(Vuex);
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  apolloProvider,
  vuetify,
  beforeCreate() {
    this.$intercom.boot({
      user_id: uuidv4()
    });
    if (locStore.get('mew-testing') === undefined) {
      locStore.set('mew-testing', false);
    }
    this.$store.commit('custom/INIT_STORE');
    this.$store.commit('global/INIT_STORE');
    this.$store.commit('notifications/INIT_STORE');
    this.$store.commit('addressBook/INIT_STORE');
    dappStoreBeforeCreate(this.$store);
    this.$store.dispatch('global/setTracking');
  },
  render: h => h(app)
});
