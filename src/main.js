/* eslint camelcase: 0 */
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import app from './app';

import Vue from 'vue';
import Router from 'vue-router';
import router from '@/router';
import store from '@/store';
import Vuex from 'vuex';

// etc
import mewComponents from '@myetherwallet/mew-components';
import languages from '@/translations';
import '@/plugins/registerServiceWorker';
import { Promise } from 'q';
import VueI18n from 'vue-i18n';
import vuetify from '@/plugins/vuetify';

import whiteSheet from '@/components/white-sheet/WhiteSheet.vue';
import MewSuperButton from '@/components/temporary-mew-components/MewSuperButton/MewSuperButton.vue';
import MewStepperHeader from '@/components/temporary-mew-components/MewStepperHeader/MewStepperHeader.vue';

Vue.prototype.$eventHub = new Vue();

//Router
Vue.use(Router);
Vue.router = router;

Vue.config.productionTip = false;

Vue.use(Vuex);

Object.keys(mewComponents).forEach(name => {
  Vue.component(name, mewComponents[name]);
});

Vue.component('Mew6WhiteSheet', whiteSheet);
Vue.component('MewSuperButton', MewSuperButton);
Vue.component('MewStepperHeader', MewStepperHeader);

// // Define vue-i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});
Vue.$i18n = i18n;

/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  vuetify,
  render: h => h(app)
});

const integration = new Integrations.Vue({
  Vue,
  attachProps: true
});

Sentry.init({
  dsn: 'https://2c4e977d74fd44d1b18083e63a3b265f@sentry.mewapi.io/1',
  integrations: [integration],
  maxBreadcrumbs: 0,
  environment: 'web',
  requestBodies: 'small',
  release: NODE_ENV === 'production' ? VERSION : 'develop',
  beforeSend(event) {
    const network =
      !store && !store.state && !store.state.network
        ? store.state.network.type.name
        : '';
    const service =
      !store && !store.state && !store.state.network
        ? store.state.network.service
        : '';
    const identifier =
      !store && !store.state && !store.state.account
        ? store.state.account.identifier
        : '';
    event.tags = {
      network: network,
      service: service,
      walletType: identifier
    };
    return new Promise(resolve => {
      vue.$eventHub.$emit('issue-modal', event, resolve);
    }).then(res => {
      return res === true ? event : null;
    });
  }
});
