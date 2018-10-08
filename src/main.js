/* eslint camelcase: 0 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import BootstrapVue from 'bootstrap-vue';
import InfiniteSlider from 'vue-infinite-slide-bar';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import VueQrcode from '@xkeshi/vue-qrcode';
import PopOver from '@/components/PopOver';

// Import Directives
import ClickOutside from '@/directives/ClickOutside';
import EnsResolver from '@/directives/EnsResolver';
// etc
import languages from './translations';
import VueMq from 'vue-mq';

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
Vue.component('infinite-slider', InfiniteSlider);
Vue.component(VueQrcode.name, VueQrcode);
Vue.component('popover', PopOver);

// Directives!!!
Vue.directive('click-outside', ClickOutside);
Vue.directive('ens-resolver', EnsResolver);

Vue.config.productionTip = false;

Vue.use(Vuex);

/* Init Bootstrap */
Vue.use(BootstrapVue);

// Define vue-i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});

Vue.filter('capitalize', function(value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
