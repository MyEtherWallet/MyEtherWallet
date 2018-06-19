import Vue from 'vue'
import Router from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout'
import CreateWalletLayout from '@/layouts/CreateWalletLayout'
import TeamLayout from '@/layouts/TeamLayout'
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout'
import TermsOfConditionsLayout from '@/layouts/TermsOfConditionsLayout'
import AccessWalletLayout from '@/layouts/AccessWalletLayout'
import InterfaceLayout from '@/layouts/InterfaceLayout'

import InteractWithContract from '@/components/Body/Transactions/Contract/InteractWithContract/InteractWithContract'
import InteractWithContract2 from '@/components/Body/Transactions/Contract/InteractWithContract2/InteractWithContract2'

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
    // },
    // {
    //   path: '/interact-with-contract',
    //   name: 'InteractWithContract',
    //   component: InteractWithContract
    // },
    // {
    //   path: '/interact-with-contract2',
    //   name: 'InteractWithContract2',
    //   component: InteractWithContract2
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
