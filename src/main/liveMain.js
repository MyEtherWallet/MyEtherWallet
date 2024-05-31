import app from './mainApp';
import '@/assets/fonts/MaterialDesignIcons/css/materialdesignicons.min.css';
import '@/assets/fonts/Roboto/css/Roboto.css';

import './sentry';
import './components';

import Vue from 'vue';
import Router from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import * as nameHashPckg from 'eth-ens-namehash';

import VueIntercom from '@mathieustan/vue-intercom';
import VueSocialSharing from 'vue-social-sharing';
import { Types } from '@amplitude/analytics-browser';

import { AmplitudeSessionReplay } from './amplitude';
/**Dapps Store */
import { dappStoreBeforeCreate } from '../dapps/dappsStore';

// overwrite fetch for session replay
const ampUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://analytics-web.mewwallet.dev'
    : 'https://analytics-web-development.mewwallet.dev';
const originalFetch = fetch;
const OVERRIDES = {
  'https://sr-client-cfg.amplitude.com/config': `${ampUrl}/config`,
  'https://api-sr.amplitude.com/sessions/v2/track': `${ampUrl}/session-replay`
};

/* eslint-disable */
fetch = async (url, options) => {
  const parsedUrl = new URL(url);
  const origin = parsedUrl.origin;
  const path = parsedUrl.pathname;
  const query = parsedUrl.search;
  const base = `${origin}${path}`;

  if (Object.keys(OVERRIDES).includes(base)) {
    url = `${OVERRIDES[base]}${query}`;
  }
  // Call the original fetch with the modified URL
  return originalFetch(url, options);
};
/* eslint-enable */

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
import lokalise from '@/core/filters/lokalise';

// etc
import '@/core/plugins/registerServiceWorker';
import vuetify from '@/core/plugins/vuetify';
import apolloProvider from './apolloProvider';
import i18n from './i18n';
import * as locStore from 'store';
import VueLazyLoad from 'vue-lazyload';

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
const popupStore = locStore.get('popups-store') || { consentToTrack: false };

const main = async () => {
  const amplitude = new AmplitudeSessionReplay(nameHashPckg.hash(VERSION), {
    instanceName:
      process.env.NODE_ENV === 'production' ? 'mew-web-prod' : 'mew-web-dev',
    serverUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://analytics-web.mewwallet.dev/record'
        : 'https://analytics-web-development.mewwallet.dev/record',
    appVersion: 1,
    trackingOptions: {
      ipAddress: false
    },
    optOut: popupStore.consentToTrack,
    identityStorage: 'none',
    logLevel: Types.LogLevel.None,
    defaultTracking: {
      formInteractions: false,
      pageViews: false
    },
    sessionReplayOptions: {
      sampleRate: 0.5
    }
  });
  Vue.prototype.$amplitude = amplitude;

  // Lazy Loader
  Vue.use(VueLazyLoad);

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
      this.$amplitude?.setOptOut(!this.$store.state.popups.consentToTrack);
    },
    render: h => h(app)
  });
};
main();
