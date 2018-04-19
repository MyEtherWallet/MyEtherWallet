// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import TopBanner from '@/components/Body/Home/TopBanner/TopBanner'
import AboutMEW from '@/components/Body/Home/AboutMEW/AboutMEW'
import FAQs from '@/components/Body/Home/FAQs/FAQs'
import News from '@/components/Body/Home/News/News'
import Social from '@/components/Body/Home/Social/Social'
import Promo from '@/components/Body/Home/Promo/Promo'

Vue.component('vue-header', Header)
Vue.component('vue-footer', Footer)
Vue.component('top-banner', TopBanner)
Vue.component('about-mew', AboutMEW)
Vue.component('faqs', FAQs)
Vue.component('news', News)
Vue.component('social', Social)
Vue.component('promo', Promo)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
