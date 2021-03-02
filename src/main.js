import app from './app';
import '@/assets/fonts/MaterialDesignIcons/css/materialdesignicons.min.css';
import '@/assets/fonts/Roboto/css/Roboto.css';

import './main/sentry';
import './main/components';

import Vue from 'vue';
import Router from 'vue-router';
import router from '@/core/router';
import store from '@/core/store';
import Vuex from 'vuex';

// etc
import '@/core/plugins/registerServiceWorker';
import vuetify from '@/core/plugins/vuetify';
import apolloProvider from './main/apolloProvider';
import i18n from './main/i18n';

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
    this.$store.commit('global/INIT_STORE');
  },
  render: h => h(app)
});
