import Vue from 'vue';
import Router from 'vue-router';
import VueIntercom from '@mathieustan/vue-intercom';
import VueSocialSharing from 'vue-social-sharing';
import Vuex from 'vuex';
import VueLazyLoad from 'vue-lazyload';
import VueCompositionAPI from '@vue/composition-api';
import { v4 as uuidv4 } from 'uuid';
import * as nameHashPckg from 'eth-ens-namehash';
import * as amplitude from '@amplitude/analytics-browser';
import * as locStore from 'store';

import app from './mainApp';
import '@/assets/fonts/MaterialDesignIcons/css/materialdesignicons.min.css';
import '@/assets/fonts/Roboto/css/Roboto.css';

import './sentry';
import './components';

/**Dapps Store */
import { dappStoreBeforeCreate } from '../dapps/dappsStore';

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
import apolloProvider from './apolloProvider';
import i18n from './i18n';

// Directives
Vue.directive('lottie', LottieAnimation);

// Filters
Vue.filter('lokalise', lokalise);

/* eslint-disable */
if (INTERCOM_ID) {
  Vue.use(VueIntercom, { appId: INTERCOM_ID });
}
/* eslint-enable */
Vue.use(VueSocialSharing);

//Router
Vue.use(Router);
Vue.use(Vuex);
Vue.config.productionTip = false;

// setup amplitude
// fake generative 32 hex character
amplitude.init(nameHashPckg.hash(VERSION), {
  instanceName:
    import.meta.env.NODE_ENV === 'production' ? 'mew-web-prod' : 'mew-web-dev',
  optOut: false,
  serverUrl:
    import.meta.env.NODE_ENV === 'production'
      ? 'https://analytics-web.mewwallet.dev/record'
      : 'https://analytics-web-development.mewwallet.dev/record',
  appVersion: VERSION,
  trackingOptions: {
    ipAddress: false
  },
  identityStorage: 'none',
  logLevel: amplitude.Types.LogLevel.None,
  defaultTracking: {
    formInteractions: false,
    pageViews: false
  }
});
Vue.prototype.$amplitude = amplitude;

// Lazy Loader
Vue.use(VueLazyLoad);

// Composition
Vue.use(VueCompositionAPI);

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  apolloProvider,
  vuetify,
  beforeCreate() {
    const userId = this.$route.query.intercomid
      ? this.$route.query.intercomid
      : uuidv4();
    this.$intercom.boot({ user_id: userId });

    if (locStore.get('mew-testing') === undefined) {
      locStore.set('mew-testing', false);
    }
    this.$store.commit('custom/INIT_STORE');
    this.$store.commit('global/INIT_STORE');
    this.$store.commit('notifications/INIT_STORE');
    this.$store.commit('addressBook/INIT_STORE');
    this.$store.commit('article/INIT_STORE');
    this.$store.commit('popups/INIT_STORE');
    dappStoreBeforeCreate(this.$store);

    this.$amplitude.setOptOut(!this.$store.state.popups.consentToTrack);
  },
  render: h => h(app)
});
