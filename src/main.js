/* eslint camelcase: 0 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import { getApp } from '@/builds/configs';
import BootstrapVue from 'bootstrap-vue';

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

/* eslint-disable-next-line */
const vue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(getApp())
});

const integration = new Integrations.Vue({ Vue, attachProps: true });

Sentry.init({
  dsn: 'https://2c4e977d74fd44d1b18083e63a3b265f@sentry.mewapi.io/1',
  integrations: [integration],
  maxBreadcrumbs: 0,
  environment: BUILD_TYPE,
  requestBodies: 'small',
  release: NODE_ENV === 'production' ? VERSION : 'develop',
  beforeSend(event) {
    const network =
      !store && !store.state.main && !store.state.main.network
        ? store.state.main.network.type.name
        : '';
    const service =
      !store && !store.state.main && !store.state.main.network
        ? store.state.main.network.service
        : '';
    const identifier =
      !store && !store.state.main && !store.state.main.account
        ? store.state.main.account.identifier
        : '';
    event.tags = {
      network: network,
      service: service,
      walletType: identifier
    };
    return new Promise(resolve => {
      vue.$eventHub.$emit('issueModal', event, resolve);
    }).then(res => {
      return res === true ? event : null;
    });
  }
});
