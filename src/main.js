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
import VueLodash from 'vue-lodash'
import vSelect from 'vue-select'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'

// Containers
import AboutContainer from '@/containers/AboutContainer'
import AccessMyWalletContainer from '@/containers/AccessMyWalletContainer'
import ByJsonFileContainer from '@/containers/ByJsonFileContainer'
import ByMnemonicContainer from '@/containers/ByMnemonicContainer'
import DappsContainer from '@/containers/DappsContainer'
import DeployContractContainer from '@/containers/DeployContractContainer'
import DomainSaleContainer from '@/containers/DomainSaleContainer'
import FaqsContainer from '@/containers/FaqsContainer'
import FooterContainer from '@/containers/FooterContainer'
import HeaderContainer from '@/containers/HeaderContainer'
import InteractWithContractContainer from '@/containers/InteractWithContractContainer'
import NewsContainer from '@/containers/NewsContainer'
import RegisterDomainContainer from '@/containers/RegisterDomainContainer'
import SendCurrencyContainer from '@/containers/SendCurrencyContainer'
import SendOfflineContainer from '@/containers/SendOfflineContainer'
import SwapContainer from '@/containers/SwapContainer'

// Regular Components
import AccessWalletButton from '@/components/AccessWalletButton'
import Blockie from '@/components/Blockie'
import ByJsonBlock from '@/components/ByJsonBlock'
import CreateWalletModal from '@/components/CreateWalletModal'
import CreateWalletInput from '@/components/CreateWalletInput'
import CreateWalletInputFooter from '@/components/CreateWalletInputFooter'
import DappButtons from '@/components/DappButtons'
import SuccessModal from '@/components/SuccessModal'
import FaqBlock from '@/components/FaqBlock'
import FinishModal from '@/components/FinishModal'
import GenerateInfo from '@/components/GenerateInfo'
import GenerateTx from '@/components/GenerateTx'
import HardwareModal from '@/components/HardwareModal'
import InterfaceAddress from '@/components/InterfaceAddress'
import InterfaceBalance from '@/components/InterfaceBalance'
import InterfaceBalanceModal from '@/components/InterfaceBalanceModal'
import InterfaceBottomText from '@/components/InterfaceBottomText'
import InterfaceNetworkModal from '@/components/InterfaceNetworkModal'
import InterfaceNetwork from '@/components/InterfaceNetwork'
import InterfaceSideMenu from '@/components/InterfaceSideMenu'
import InterfaceTokens from '@/components/InterfaceTokens'
import MetamaskModal from '@/components/MetamaskModal'
import MewConnectModal from '@/components/MewConnectModal'
import NetworkAndAddressModal from '@/components/NetworkAndAddressModal'
import NewsArticle from '@/components/NewsArticle'
import PageFooter from '@/components/PageFooter'
import PasswordModal from '@/components/PasswordModal'
import PageTitle from '@/components/PageTitle'
import PriceBar from '@/components/PriceBar'
import Promo from '@/components/Promo'
import SendTx from '@/components/SendTx'
import Social from '@/components/Social'
import SoftwareModal from '@/components/SoftwareModal'
import TopBanner from '@/components/TopBanner'
import TutorialModal from '@/components/TutorialModal'
import VerificationModal from '@/components/VerificationModal'

// etc
import languages from './translations'

// Containers
Vue.component('about', AboutContainer)
Vue.component('access-my-wallet-container', AccessMyWalletContainer)
Vue.component('by-json-file-container', ByJsonFileContainer)
Vue.component('by-mnemonic-container', ByMnemonicContainer)
Vue.component('dapps-container', DappsContainer)
Vue.component('domain-sale-container', DomainSaleContainer)
Vue.component('deploy-contract-container', DeployContractContainer)
Vue.component('faqs', FaqsContainer)
Vue.component('footer-container', FooterContainer)
Vue.component('header-container', HeaderContainer)
Vue.component('interact-with-contract-container', InteractWithContractContainer)
Vue.component('news', NewsContainer)
Vue.component('register-domain-container', RegisterDomainContainer)
Vue.component('send-currency-container', SendCurrencyContainer)
Vue.component('send-offline-container', SendOfflineContainer)
Vue.component('swap-container', SwapContainer)

// Regular Components
Vue.component('access-wallet-button', AccessWalletButton)
Vue.component('blockie', Blockie)
Vue.component('by-json-block', ByJsonBlock)
Vue.component('create-wallet-input', CreateWalletInput)
Vue.component('create-wallet-input-footer', CreateWalletInputFooter)
Vue.component('create-wallet-modal', CreateWalletModal)
Vue.component('dapp-buttons', DappButtons)
Vue.component('success-modal', SuccessModal)
Vue.component('faq-block', FaqBlock)
Vue.component('finish-modal', FinishModal)
Vue.component('generate-info', GenerateInfo)
Vue.component('generate-tx', GenerateTx)
Vue.component('hardware-modal', HardwareModal)
Vue.component('interface-address', InterfaceAddress)
Vue.component('interface-balance-modal', InterfaceBalanceModal)
Vue.component('interface-balance', InterfaceBalance)
Vue.component('interface-bottom-text', InterfaceBottomText)
Vue.component('interface-network', InterfaceNetwork)
Vue.component('interface-network-modal', InterfaceNetworkModal)
Vue.component('interface-tokens', InterfaceTokens)
Vue.component('metamask-modal', MetamaskModal)
Vue.component('mew-connect-modal', MewConnectModal)
Vue.component('network-and-address-modal', NetworkAndAddressModal)
Vue.component('news-article', NewsArticle)
Vue.component('by-json-page-footer', PageFooter)
Vue.component('password-modal', PasswordModal)
Vue.component('by-json-page-title', PageTitle)
Vue.component('price-bar', PriceBar)
Vue.component('promo', Promo)
Vue.component('send-tx', SendTx)
Vue.component('social', Social)
Vue.component('software-modal', SoftwareModal)
Vue.component('interface-side-menu', InterfaceSideMenu)
Vue.component('top-banner', TopBanner)
Vue.component('tutorial-modal', TutorialModal)
Vue.component('verification-modal', VerificationModal)

Vue.component('v-select', vSelect)
Vue.component('infinite-slider', InfiniteSlider)

Vue.config.productionTip = false

Vue.use(Vuex)

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
