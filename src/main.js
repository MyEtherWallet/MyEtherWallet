/* eslint camelcase: 0 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as Sentry from '@sentry/browser';
import { getApp } from '@/builds/configs';
import BootstrapVue from 'bootstrap-vue';

import '@/assets/font-awesome.css';
import '@/assets/google-fonts.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import Router from 'vue-router';
import router from '@/router';
import store from '@/store';
// import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import VueQrcode from '@xkeshi/vue-qrcode';
import Toasted from 'vue-toasted';
import * as toastConfig from './toast.config';

import PopOver from '@/components/PopOver';
import StandardButton from '@/components/Buttons/StandardButton';
import StandardInput from '@/components/StandardInput';

// Import Directives
import ClickOutside from '@/directives/ClickOutside';
import EnsResolver from '@/directives/EnsResolver';

// Import Filters
import Capitalize from '@/filters/Capitalize';
import ConcatAddr from '@/filters/ConcatAddr';
// etc
// import i18n from './translation.config.js';
import languages from '@/translations';
import VueMq from 'vue-mq';
import VeeValidate from 'vee-validate';
import './registerServiceWorker';
import { Promise } from 'q';
import VueI18n from 'vue-i18n';

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
// Vue.component('infinite-slider', InfiniteSlider);
Vue.component(VueQrcode.name, VueQrcode);
Vue.component('popover', PopOver);

//Router
Vue.use(Router);
Vue.router = router;
// Directives!!!
Vue.directive('click-outside', ClickOutside);
Vue.directive('ens-resolver', EnsResolver);

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
const i18n = new VueI18n({
  locale: 'en_US',
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

/* eslint-disable no-new */
const vue = new Vue({
  i18n,
  router,
  store,
  render: h => h(getApp())
}).$mount('#app');

Sentry.init({
  dsn: 'https://2c4e977d74fd44d1b18083e63a3b265f@sentry.mewapi.io/1',
  integrations: [new Sentry.Integrations.Vue({ vue })],
  maxBreadcrumbs: 0,
  environment: BUILD_TYPE,
  requestBodies: 'small',
  release: NODE_ENV === 'production' ? VERSION : 'develop',
  beforeSend(event) {
    event.tags = {
      network: store.getters.network.type.name,
      service: store.getters.network.service,
      walletType: store.getters.account.identifier
    };
    return new Promise(resolve => {
      vue.$eventHub.$emit('issueModal', event, resolve);
    }).then(res => {
      return res === true ? event : null;
    });
  }
});
