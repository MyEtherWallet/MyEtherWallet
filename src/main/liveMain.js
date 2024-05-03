import Vue from 'vue';
import Router from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import * as nameHashPckg from 'eth-ens-namehash';
import Configs from '@/core/store/configs.js';

import VueIntercom from '@mathieustan/vue-intercom';
import VueSocialSharing from 'vue-social-sharing';
import * as amplitude from '@amplitude/analytics-browser';

import { PiniaVuePlugin, createPinia } from 'pinia';
const pinia = createPinia();

import app from './mainApp';
import '@/assets/fonts/MaterialDesignIcons/css/materialdesignicons.min.css';
import '@/assets/fonts/Roboto/css/Roboto.css';

import './components';
import './sentry';

/**Dapps Store */
// import { dappStoreBeforeCreate } from '../dapps/dappsStore';

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

import { useGlobalStore } from '../core/store/global';
import { useCustomStore } from '../core/store/custom';
import { useNotificationsStore } from '../core/store/notifications';
import { useAddressBookStore } from '../core/store/addressBook';
import { useArticleStore } from '../core/store/article';
import { usePopupStore } from '../core/store/popups';
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
Vue.use(PiniaVuePlugin);
Vue.config.productionTip = false;

// setup amplitude
// fake generative 32 hex character
const popupStore = locStore.get('popups-store') || { consentToTrack: false };

amplitude.init(nameHashPckg.hash(VERSION), {
  instanceName:
    process.env.NODE_ENV === 'production' ? 'mew-web-prod' : 'mew-web-dev',
  optOut: popupStore.consentToTrack,
  serverUrl:
    process.env.NODE_ENV === 'production'
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

new Vue({
  el: '#app',
  i18n,
  pinia,
  router,
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
    const customStore = useCustomStore();
    const globalStore = useGlobalStore();
    const notificationsStore = useNotificationsStore();
    const addressBookStore = useAddressBookStore();
    const articleStore = useArticleStore();
    const { consentToTrack } = usePopupStore();

    customStore.$patch(state => {
      this.initStore(state, Configs, 'custom');
    });
    globalStore.$patch(state => {
      this.initStore(state, Configs, 'global');
    });
    notificationsStore.$patch(state => {
      this.initStore(state, Configs, 'notifications');
    });
    addressBookStore.$patch(state => {
      this.initStore(state, Configs, 'addressBook');
    });
    articleStore.$patch(state => {
      this.initStore(state, Configs, 'article');
    });

    this.$amplitude.setOptOut(!consentToTrack);
  },
  methods: {
    initStore(state, config, storeName) {
      if (locStore.get(config.LOCAL_STORAGE_KEYS[storeName])) {
        const savedStore = locStore.get(config.LOCAL_STORAGE_KEYS[storeName]);
        if (savedStore.stateVersion === config.VERSION[storeName]) {
          state = Object.assign(state, savedStore);
        }
      }
    }
  },
  render: h => h(app)
});
