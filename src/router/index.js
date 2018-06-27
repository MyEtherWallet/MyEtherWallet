import Vue from 'vue'
import Router from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout'
import CreateWalletLayout from '@/layouts/CreateWalletLayout'
import TeamLayout from '@/layouts/TeamLayout'
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout'
import TermsOfConditionsLayout from '@/layouts/TermsOfConditionsLayout'
import AccessWalletLayout from '@/layouts/AccessWalletLayout'
import InterfaceLayout from '@/layouts/InterfaceLayout'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeLayout
    },
    {
      path: '/create-wallet',
      name: 'CreateWalletLayout',
      component: CreateWalletLayout,
      beforeEnter: function (to, from, next) {
        window.scrollTo(0, 0)
        next()
      }
    },
    {
      path: '/team',
      name: 'TeamLayout',
      component: TeamLayout,
      beforeEnter: function (to, from, next) {
        window.scrollTo(0, 0)
        next()
      }
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicyLayout',
      component: PrivacyPolicyLayout,
      beforeEnter: function (to, from, next) {
        window.scrollTo(0, 0)
        next()
      }
    },
    {
      path: '/terms-of-conditions',
      name: 'TermsOfConditionsLayout',
      component: TermsOfConditionsLayout,
      beforeEnter: function (to, from, next) {
        window.scrollTo(0, 0)
        next()
      }
    },
    {
      path: '/access-my-wallet',
      name: 'AccessWalletLayout',
      component: AccessWalletLayout,
      beforeEnter: function (to, from, next) {
        window.scrollTo(0, 0)
        next()
      }
    },
    {
      path: '/interface',
      name: 'InterfaceLayout',
      component: InterfaceLayout,
      beforeEnter: function (to, from, next) {
        window.scrollTo(0, 0)
        next()
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
})
