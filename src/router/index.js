import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Body/Home/Home'
import ByJsonFile from '@/components/Body/CreateWallet/ByJsonFile/ByJsonFile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/create-wallet-by-json-file',
      name: 'ByJsonFile',
      component: ByJsonFile
    }
  ]
})
