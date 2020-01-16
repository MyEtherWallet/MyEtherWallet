/* eslint camelcase: 0 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import(/* webpackPreload: true */ '@/assets/font-awesome.css');
import(/* webpackPreload: true */ '@/assets/google-fonts.css');

const ExtensionWeb3Popup = () => import('@/layouts/ExtensionWeb3Popup');
const Web3DetectedContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/Web3DetectedContainer');
const AccountAccessContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/AccountAccessContainer');
const SignTxContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/SignTxContainer');
const SignMsgContainer = () =>
  import('@/layouts/ExtensionWeb3Popup/containers/SignMsgContainer');
import { Misc, ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
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
// import router from '@/router';
import store from '@/store';
import Vuex from 'vuex';

import AddrResolver from '@/directives/AddrResolver';
import ConcatAddr from '@/filters/ConcatAddr';

// etc
import languages from '@/translations';
import VueI18n from 'vue-i18n';

// Router
Vue.use(Router);
const storeQuery = query => {
  const queryKeys = Object.keys(query);
  if (queryKeys.length > 0) {
    const blankObj = {};
    for (const key in query) {
      blankObj[key] = Misc.stripTags(query[key]);
    }

    store.dispatch('saveQueryVal', blankObj);
  }
};

const router = new Router({
  mode: getMode(),
  routes: [
    {
      path: '/',
      name: 'Web3 Detected',
      meta: { requiresAuth: false },
      component: ExtensionWeb3Popup,
      children: [
        {
          path: 'web3-detected',
          component: Web3DetectedContainer,
          meta: { requiresAuth: false }
        },
        {
          path: 'account-access',
          component: AccountAccessContainer,
          meta: { requiresAuth: false }
        },
        {
          path: 'sign-tx',
          component: SignTxContainer,
          meta: { requiresAuth: false }
        },
        {
          path: 'sign-msg',
          component: SignMsgContainer,
          meta: { requiresAuth: false }
        }
      ]
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

router.beforeResolve((to, from, next) => {
  storeQuery(to.query);
  if (to.meta.hasOwnProperty('requiresAuth')) {
    next();
  } else {
    if (store.state.wallet === null) {
      if (BUILD_TYPE === 'mewcx') {
        ExtensionHelpers.getAccounts(item => {
          const hasStoredWallet = Object.keys(item).filter(key => {
            const newObj = {};
            if (isAddress(key)) {
              return (newObj[key] = item[key]);
            }
          });
          if (hasStoredWallet.length > 0) {
            next('/');
          } else {
            next({ name: 'AccessWalletLayout' });
          }
        });
      } else {
        store.dispatch('setLastPath', to.path);
        next({ name: 'AccessWalletLayout' });
      }
    } else {
      if (store.state.path !== '') {
        const localPath = store.state.path;
        store.dispatch('setLastPath', '');
        next({ path: localPath });
      } else {
        next();
      }
    }
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
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(app)
});
