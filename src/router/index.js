import Vue from 'vue'
import Router from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout'
import CreateWalletLayout from '@/layouts/CreateWalletLayout'
import TeamLayout from '@/layouts/TeamLayout'
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout'
import TermsOfConditionsLayout from '@/layouts/TermsOfConditionsLayout'
import AccessWalletLayout from '@/layouts/AccessWalletLayout'
import SendTransactionLayout from '@/layouts/SendTransactionLayout'

// CLEANUP
import SendEthAndTokens from '@/components/Body/Transactions/SendEthAndTokens/SendEthAndTokens'
import SendOffline from '@/components/Body/Transactions/SendOffline/SendOffline'
import Swap from '@/components/Body/Transactions/Swap/Swap'
import Dapps from '@/components/Body/Transactions/Dapps/Dapps'
import RegisterDomainENS from '@/components/Body/Transactions/Dapps/RegisterDomainENS/RegisterDomainENS'
import DomainSale from '@/components/Body/Transactions/Dapps/DomainSale/DomainSale'

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
      path: '/send-eth-and-tokens',
      name: 'SendTransactionContainer',
      component: SendTransactionContainer
    },
    // Update this
    {
      path: '/send-eth-diff'
      name: 'SendEthAndTokens',
      component: SendEthAndTokens
    },
    {
      path: '/send-offline',
      name: 'SendOffline',
      component: SendOffline
    },
    {
      path: '/swap',
      name: 'Swap',
      component: Swap
    },
    {
      path: '/dapps',
      name: 'Dapps',
      component: Dapps
    },
    {
      path: '/register-domain',
      name: 'RegisterDomainENS',
      component: RegisterDomainENS
    },
    {
      path: '/domain-sale',
      name: 'DomainSale',
      component: DomainSale
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
