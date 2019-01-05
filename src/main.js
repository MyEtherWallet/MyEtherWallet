/* eslint camelcase: 0 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import { getApp } from '@/builds/configs';
import BootstrapVue from 'bootstrap-vue';
// import InfiniteSlider from 'vue-infinite-slide-bar';
import '@/assets/font-awesome.css';
import '@/assets/google-fonts.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import VueQrcode from '@xkeshi/vue-qrcode';
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
import languages from '@/translations';
import VueMq from 'vue-mq';
import VeeValidate from 'vee-validate';
import './registerServiceWorker';

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

// Define vue-i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
  messages: languages,
  silentTranslationWarn: true
});

/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  render: h => h(getApp())
}).$mount('#app');
