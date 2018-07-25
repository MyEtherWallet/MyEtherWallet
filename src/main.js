//
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import BootstrapVue from 'bootstrap-vue'
import InfiniteSlider from 'vue-infinite-slide-bar'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'
import VueQrcode from '@xkeshi/vue-qrcode'

// etc
import languages from './translations'

// Regular Components
Vue.component('infinite-slider', InfiniteSlider)
Vue.component(VueQrcode.name, VueQrcode)

Vue.config.productionTip = false

Vue.use(Vuex)

/* Init Bootstrap */
Vue.use(BootstrapVue)

// Define vue-i18n
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'gb',
  fallbackLocale: 'gb',
  messages: languages,
  silentTranslationWarn: true
})

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
