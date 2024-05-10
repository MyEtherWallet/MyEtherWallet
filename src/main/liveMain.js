import Vue, { provide } from 'vue';
import Router from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import * as nameHashPckg from 'eth-ens-namehash';
import Configs from '@/core/store/configs.js';

import VueIntercom from '@mathieustan/vue-intercom';
import VueSocialSharing from 'vue-social-sharing';
import * as amplitude from '@amplitude/analytics-browser';
import { ApolloClients } from '@vue/apollo-composable';

import { PiniaVuePlugin, createPinia } from 'pinia';
const pinia = createPinia();

import app from './mainApp';
import '@/assets/fonts/MaterialDesignIcons/css/materialdesignicons.min.css';
import '@/assets/fonts/Roboto/css/Roboto.css';

import clients from '@/apollo/index.js';
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
import { i18n } from './i18n';
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

Vue.use(PiniaVuePlugin);
//Router
Vue.use(Router);
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
  vuetify,
  setup() {
    provide(ApolloClients, clients);
  },
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
      if (locStore.get(Configs.LOCAL_STORAGE_KEYS['custom'])) {
        const savedStore = locStore.get(Configs.LOCAL_STORAGE_KEYS['custom']);
        if (savedStore.stateVersion === Configs.VERSION['custom']) {
          Object.assign(state, savedStore);
        }
      }
    });
    globalStore.$patch(state => {
      if (locStore.get(Configs.LOCAL_STORAGE_KEYS['global'])) {
        const savedStore = locStore.get(Configs.LOCAL_STORAGE_KEYS['global']);
        if (savedStore.stateVersion === Configs.VERSION['global']) {
          Object.assign(state, savedStore);
        }
      }
    });
    notificationsStore.$patch(state => {
      if (locStore.get(Configs.LOCAL_STORAGE_KEYS['notifications'])) {
        const savedStore = locStore.get(
          Configs.LOCAL_STORAGE_KEYS['notifications']
        );
        if (savedStore.stateVersion === Configs.VERSION['notifications']) {
          Object.assign(state, savedStore);
        }
      }
    });
    addressBookStore.$patch(state => {
      if (locStore.get(Configs.LOCAL_STORAGE_KEYS['addressBook'])) {
        const savedStore = locStore.get(
          Configs.LOCAL_STORAGE_KEYS['addressBook']
        );
        if (savedStore.stateVersion === Configs.VERSION['addressBook']) {
          Object.assign(state, savedStore);
        }
      }
    });
    articleStore.$patch(state => {
      if (locStore.get(Configs.LOCAL_STORAGE_KEYS['article'])) {
        const savedStore = locStore.get(Configs.LOCAL_STORAGE_KEYS['article']);
        if (savedStore.stateVersion === Configs.VERSION['article']) {
          Object.assign(state, savedStore);
        }
      }
    });

    this.$amplitude.setOptOut(!consentToTrack);
  },
  render: h => h(app)
});
