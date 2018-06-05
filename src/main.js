// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLodash from 'vue-lodash'
import vSelect from 'vue-select'
import VueI18n from 'vue-i18n'

// Containers
import FaqsContainer from '@/containers/FaqsContainer'
import FooterContainer from '@/containers/FooterContainer'
import HeaderContainer from '@/containers/HeaderContainer'

// Regular Components
import TopBanner from '@/components/TopBanner'
import AboutMEW from '@/components/AboutMEW'
import News from '@/components/News'
import FaqBlock from '@/components/FaqBlock'
import ByJsonBlock from '@/components/ByJsonBlock'
import Social from '@/components/Social'
import Promo from '@/components/Promo'
import PriceBar from '@/components/PriceBar'
import PageTitle from '@/components/PageTitle'
import PageFooter from '@/components/PageFooter'
import CreateWalletModal from '@/components/CreateWalletModal'
import AccessMyWalletOptions from '@/components/AccessMyWalletOptions'
import TransactionsSideMenu from '@/components/TransactionsSideMenu'
import TransactionAddress from '@/components/TransactionAddress'
import TransactionBalance from '@/components/TransactionBalance'
import TransactionNetwork from '@/components/TransactionNetwork'

import languages from './translations'

// Containers
Vue.component('faqs', FaqsContainer)
Vue.component('footer-container', FooterContainer)
Vue.component('header-container', HeaderContainer)

// Regular Components
Vue.component('top-banner', TopBanner)
Vue.component('about-mew', AboutMEW)
Vue.component('news', News)
Vue.component('faq-block', FaqBlock)
Vue.component('by-json-block', ByJsonBlock)
Vue.component('social', Social)
Vue.component('promo', Promo)
Vue.component('by-json-page-title', PageTitle)
Vue.component('by-json-page-footer', PageFooter)
Vue.component('create-wallet-modal', CreateWalletModal)
Vue.component('price-bar', PriceBar)
Vue.component('access-my-wallet-options', AccessMyWalletOptions)
Vue.component('transactions-side-menu', TransactionsSideMenu)
Vue.component('transaction-address', TransactionAddress)
Vue.component('transaction-balance', TransactionBalance)
Vue.component('transaction-network', TransactionNetwork)
Vue.component('transaction-tokens', TransactionTokens)

Vue.component('v-select', vSelect)

Vue.config.productionTip = false

/* Init Bootstrap */
Vue.use(BootstrapVue)

/* Init Lodash */
const options = { name: 'lodash' }
Vue.use(VueLodash, options)

// Define vue-i18n
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'gb',
  fallbackLocale: 'gb',
  messages: languages
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
