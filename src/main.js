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

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
// import TopBanner from '@/components/Body/Home/TopBanner/TopBanner'
// import AboutMEW from '@/components/Body/Home/AboutMEW/AboutMEW'
// import FAQs from '@/components/Body/Home/FAQs/FAQs'
// import News from '@/components/Body/Home/News/News'
// import Social from '@/components/Body/Home/Social/Social'
// import Promo from '@/components/Body/Home/Promo/Promo'
import ByJsonPageTitle from '@/components/Body/CreateWallet/ByJsonOrMnemonic/PageTitle/PageTitle'
import ByJsonPageFooter from '@/components/Body/CreateWallet/ByJsonOrMnemonic/PageFooter/PageFooter'
import PriceBar from '@/components/Body/SmallComponents/PriceBar/PriceBar'
import AccessMyWalletOptions from '@/components/Body/AccessMyWallet/AccessMyWalletOptions/AccessMyWalletOptions'
import TransactionsSideMenu from '@/components/Body/Transactions/TransactionsSideMenu/TransactionsSideMenu'
import TransactionAddress from '@/components/Body/Transactions/TransactionsComponents/TransactionAddress/TransactionAddress'
import TransactionBalance from '@/components/Body/Transactions/TransactionsComponents/TransactionBalance/TransactionBalance'
import TransactionNetwork from '@/components/Body/Transactions/TransactionsComponents/TransactionNetwork/TransactionNetwork'
import TransactionTokens from '@/components/Body/Transactions/TransactionsComponents/TransactionTokens/TransactionTokens'

import languages from './translations'

Vue.component('vue-header', Header)
Vue.component('vue-footer', Footer)
// Vue.component('top-banner', TopBanner)
// Vue.component('about-mew', AboutMEW)
// Vue.component('faqs', FAQs)
// Vue.component('news', News)
// Vue.component('social', Social)
// Vue.component('promo', Promo)
Vue.component('by-json-page-title', ByJsonPageTitle)
Vue.component('by-json-page-footer', ByJsonPageFooter)
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})
