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
import AboutContainer from '@/containers/AboutContainer'
import AccessMyWalletContainer from '@/containers/AccessMyWalletContainer'
import ByJsonFileContainer from '@/containers/ByJsonFileContainer'
import ByMnemonicContainer from '@/containers/ByMnemonicContainer'
import FaqsContainer from '@/containers/FaqsContainer'
import FooterContainer from '@/containers/FooterContainer'
import HeaderContainer from '@/containers/HeaderContainer'
import NewsContainer from '@/containers/NewsContainer'

// Regular Components
import AccessWalletButton from '@/components/AccessWalletButton'
import ByJsonBlock from '@/components/ByJsonBlock'
import CreateWalletModal from '@/components/CreateWalletModal'
import CreateWalletInput from '@/components/CreateWalletInput'
import CreateWalletInputFooter from '@/components/CreateWalletInputFooter'
import FaqBlock from '@/components/FaqBlock'
import HardwareModal from '@/components/HardwareModal'
import MetamaskModal from '@/components/MetamaskModal'
import MewConnectModal from '@/components/MewConnectModal'
import NetworkAndAddressModal from '@/components/NetworkAndAddressModal'
import NewsArticle from '@/components/NewsArticle'
import PageFooter from '@/components/PageFooter'
import PageTitle from '@/components/PageTitle'
import PriceBar from '@/components/PriceBar'
import Promo from '@/components/Promo'
import Social from '@/components/Social'
import SoftwareModal from '@/components/SoftwareModal'
import TransactionAddress from '@/components/TransactionAddress'
import TransactionBalance from '@/components/TransactionBalance'
import TransactionNetwork from '@/components/TransactionNetwork'
import TransactionsSideMenu from '@/components/TransactionsSideMenu'
import TopBanner from '@/components/TopBanner'

// etc
import languages from './translations'

// Containers
Vue.component('about', AboutContainer)
Vue.component('access-my-wallet-container', AccessMyWalletContainer)
Vue.component('by-json-file-container', ByJsonFileContainer)
Vue.component('by-mnemonic-container', ByMnemonicContainer)
Vue.component('faqs', FaqsContainer)
Vue.component('footer-container', FooterContainer)
Vue.component('header-container', HeaderContainer)
Vue.component('news', NewsContainer)

// Regular Components
Vue.component('access-wallet-button', AccessWalletButton)
Vue.component('by-json-block', ByJsonBlock)
Vue.component('create-wallet-input', CreateWalletInput)
Vue.component('create-wallet-input-footer', CreateWalletInputFooter)
Vue.component('create-wallet-modal', CreateWalletModal)
Vue.component('faq-block', FaqBlock)
Vue.component('hardware-modal', HardwareModal)
Vue.component('metamask-modal', MetamaskModal)
Vue.component('mew-connect-modal', MewConnectModal)
Vue.component('network-and-address-modal', NetworkAndAddressModal)
Vue.component('news-article', NewsArticle)
Vue.component('by-json-page-footer', PageFooter)
Vue.component('by-json-page-title', PageTitle)
Vue.component('price-bar', PriceBar)
Vue.component('promo', Promo)
Vue.component('social', Social)
Vue.component('software-modal', SoftwareModal)
Vue.component('transaction-address', TransactionAddress)
Vue.component('transaction-balance', TransactionBalance)
Vue.component('transaction-network', TransactionNetwork)
Vue.component('transactions-side-menu', TransactionsSideMenu)
Vue.component('top-banner', TopBanner)
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
