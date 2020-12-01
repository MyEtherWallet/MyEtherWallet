/* eslint camelcase: 0 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import(/* webpackPreload: true */ '@/assets/font-awesome.css');
import(/* webpackPreload: true */ '@/assets/google-fonts.css');

const ExtensionPopup = () => import('@/layouts/ExtensionPopup');
const app = () => import('./app');
import { getMode } from '@/builds/configs';

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

import store from '@/store';
import Vuex from 'vuex';

import AddrResolver from '@/directives/AddrResolver';
import ConcatAddr from '@/filters/ConcatAddr';

// etc
import languages from '@/translations';
import VueI18n from 'vue-i18n';

// Router
Vue.use(Router);
const router = new Router({
  mode: getMode(),
  routes: [
    {
      path: '/',
      name: 'Popup',
      component: ExtensionPopup,
      meta: { requiresAuth: false }
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash
      };
    }
    window.scrollTo(0, 0);
  }
});
Vue.router = router;

Vue.directive('addr-resolver', AddrResolver);
Vue.filter('concatAddr', ConcatAddr);

Vue.config.productionTip = false;

Vue.use(Vuex);

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

/* eslint-disable-next-line */
const vue = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(app)
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
