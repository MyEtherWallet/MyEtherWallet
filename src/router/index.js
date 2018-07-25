import Vue from 'vue'
import Router from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout'
import CreateWalletLayout from '@/layouts/CreateWalletLayout'
import TeamLayout from '@/layouts/TeamLayout'
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout'
import TermsOfConditionsLayout from '@/layouts/TermsOfConditionsLayout'
import AccessWalletLayout from '@/layouts/AccessWalletLayout'
import InterfaceLayout from '@/layouts/InterfaceLayout'
import NotFoundLayout from '@/layouts/NotFoundLayout'
import WalletNotFoundLayout from '@/layouts/WalletNotFoundLayout'
import {router as routerConfig} from '@/configs/build'

Vue.use(Router)

export default new Router({
  mode: routerConfig.mode,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeLayout
    },
    {
      path: '/create-wallet',
      name: 'CreateWalletLayout',
      component: CreateWalletLayout
    },
    {
      path: '/team',
      name: 'TeamLayout',
      component: TeamLayout
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicyLayout',
      component: PrivacyPolicyLayout
    },
    {
      path: '/terms-of-conditions',
      name: 'TermsOfConditionsLayout',
      component: TermsOfConditionsLayout
    },
    {
      path: '/access-my-wallet',
      name: 'AccessWalletLayout',
      component: AccessWalletLayout
    },
    {
      path: '/interface',
      name: 'InterfaceLayout',
      component: InterfaceLayout
    },
    {
      path: '*',
      name: '404',
      component: NotFoundLayout
    },
    {
      path: '/wallet-not-found',
      name: 'WalletNotFoundLayout',
      component: WalletNotFoundLayout
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      window.scrollTo(0, 0)
    }
  }
})
