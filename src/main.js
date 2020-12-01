/* eslint camelcase: 0 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import { getApp } from '@/builds/configs';
import BootstrapVue from 'bootstrap-vue';
import { MEW_CX } from '@/builds/configs/types';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import(/* webpackPreload: true */ '@/assets/font-awesome.css');
import(/* webpackPreload: true */ '@/assets/google-fonts.css');

import Vue from 'vue';
import Router from 'vue-router';
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;
Router.prototype.push = function push(path) {
  return originalPush.call(this, path).catch(err => err);
};
Router.prototype.replace = function push(path) {
  return originalReplace.call(this, path).catch(err => err);
};
Router.prototype.originalPush = originalPush; // Incase we do want to handle on resolve or on abort
Router.prototype.originalReplace = originalReplace; // Incase we do want to handle on resolve or on abort
import router from '@/router';
import store from '@/store';
import Vuex from 'vuex';
import VueQrcode from '@xkeshi/vue-qrcode';
import Toasted from 'vue-toasted';
import * as toastConfig from './toast.config';

import PopOver from '@/components/PopOver';
import StandardButton from '@/components/Buttons/StandardButton';
import StandardInput from '@/components/StandardInput';

// Import Directives
import ClickOutside from '@/directives/ClickOutside';
import AddrResolver from '@/directives/AddrResolver';
import LazyLoad from '@/directives/LazyLoad';

// Import Filters
import Capitalize from '@/filters/Capitalize';
import ConcatAddr from '@/filters/ConcatAddr';
// etc
import languages from '@/translations';
import VueMq from 'vue-mq';
import VeeValidate from 'vee-validate';
import './registerServiceWorker';
import { Promise } from 'q';
import VueI18n from 'vue-i18n';
import langShortCodes from '@/translations/getShortCodes';
import globalErrorHandler from '@/globalErrorHandler';

const getDefaultLang = () => {
  if (router.options.base) {
    const shortCode = router.options.base.replace('/', '');
    if (Object.keys(langShortCodes).includes(shortCode)) {
      store.dispatch('main/setLocale', {
        locale: langShortCodes[shortCode],
        save: false
      });
      return langShortCodes[shortCode];
    }
  }
  return 'en_US';
};

Vue.use(VueMq, {
  breakpoints: {
    // default breakpoints - customize this
    sm: 414,
    md: 1024,
    lg: Infinity
  }
});
Vue.prototype.$eventHub = new Vue();

// Regular Components
Vue.component(VueQrcode.name, VueQrcode);
Vue.component('popover', PopOver);

//Router
Vue.use(Router);
Vue.router = router;
// Directives!!!
Vue.directive('click-outside', ClickOutside);
Vue.directive('addr-resolver', AddrResolver);
Vue.directive('lazy-load', LazyLoad);

// Filters!!!
Vue.filter('capitalize', Capitalize);
Vue.filter('concatAddr', ConcatAddr);

Vue.component('standard-button', StandardButton);
Vue.component('standard-input', StandardInput);

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VeeValidate);

/* Init Bootstrap */
Vue.use(BootstrapVue);

// // Define vue-i18n
Vue.use(VueI18n);
Vue.config.keyCodes = {
  enter: [13]
};
const i18n = new VueI18n({
  locale: getDefaultLang(),
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});
Vue.$i18n = i18n;

// Register global toasts
Vue.use(Toasted);
Object.keys(toastConfig).forEach(item => {
  Vue.toasted.register(
    toastConfig[item].name,
    toastConfig[item].payloadFunc,
    toastConfig[item].options
  );
});

/* eslint-disable-next-line */
const vue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(getApp())
});

const integration = new Integrations.Vue({ Vue, attachProps: true });
const sentryVersion = BUILD_TYPE === MEW_CX ? `${VERSION}-cx` : VERSION;
Sentry.init({
  dsn:
    'https://8c29b655fc4e433494fbba7bcac35ae3@o382951.ingest.sentry.io/5230441',
  integrations: [integration],
  maxBreadcrumbs: 0,
  environment: BUILD_TYPE,
  requestBodies: 'small',
  release: NODE_ENV === 'production' ? sentryVersion : 'develop',
  beforeSend(event) {
    for (const exceptionIdx in event.exception.values) {
      if (globalErrorHandler(event.exception.values[exceptionIdx])) {
        event.exception.values.splice(exceptionIdx, 1);
      }
    }
    if (!event.exception.values.length) return Promise.resolve(null);
    const network =
      store &&
      store.state.main &&
      store.state.main.network &&
      store.state.main.network.type
        ? store.state.main.network.type.name
        : '';
    const service =
      store && store.state.main && store.state.main.network
        ? store.state.main.network.service
        : '';
    const walletType =
      store && store.state.main && store.state.main.account
        ? store.state.main.account.identifier
        : '';
    event.tags = {
      network,
      service,
      walletType
    };
    return new Promise(resolve => {
      vue.$eventHub.$emit('issueModal', event, resolve);
    }).then(res => {
      return res === true ? event : null;
    });
  }
});
