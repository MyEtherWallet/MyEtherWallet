// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLodash from 'vue-lodash'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import TopBanner from '@/components/Body/Home/TopBanner/TopBanner'
import AboutMEW from '@/components/Body/Home/AboutMEW/AboutMEW'
import FAQs from '@/components/Body/Home/FAQs/FAQs'
import News from '@/components/Body/Home/News/News'
import Social from '@/components/Body/Home/Social/Social'
import Promo from '@/components/Body/Home/Promo/Promo'

import ByJsonYourPassword from '@/components/Body/CreateWallet/ByJsonFile/YourPassword/YourPassword'
import ByJsonPageTitle from '@/components/Body/CreateWallet/ByJsonFile/PageTitle/PageTitle'
import ByJsonPageFooter from '@/components/Body/CreateWallet/ByJsonFile/PageFooter/PageFooter'

Vue.component('vue-header', Header)
Vue.component('vue-footer', Footer)
Vue.component('top-banner', TopBanner)
Vue.component('about-mew', AboutMEW)
Vue.component('faqs', FAQs)
Vue.component('news', News)
Vue.component('social', Social)
Vue.component('promo', Promo)

Vue.component('by-json-your-password', ByJsonYourPassword)
Vue.component('by-json-page-title', ByJsonPageTitle)
Vue.component('by-json-page-footer', ByJsonPageFooter)

Vue.config.productionTip = false

/* Init Lodash */
const options = { name: 'lodash' }
Vue.use(VueLodash, options)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
