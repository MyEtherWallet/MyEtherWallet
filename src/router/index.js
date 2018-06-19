import Vue from 'vue'
import Router from 'vue-router'
import HomeLayout from '@/layouts/HomeLayout'
import CreateWalletLayout from '@/layouts/CreateWalletLayout'
import TeamLayout from '@/layouts/TeamLayout'
import PrivacyPolicyLayout from '@/layouts/PrivacyPolicyLayout'
import TermsOfConditionsLayout from '@/layouts/TermsOfConditionsLayout'
import AccessWalletLayout from '@/layouts/AccessWalletLayout'
import InterfaceLayout from '@/layouts/InterfaceLayout'
// import Home from '@/components/Body/Home/Home'
// import CreateWallet from '@/components/Body/CreateWallet/ByJsonOrMnemonic/YourPassword/YourPassword'
// import ByJsonFile from '@/components/Body/CreateWallet/ByJsonOrMnemonic/ByJsonFile/ByJsonFile'
// import ByMnemonic from '@/components/Body/CreateWallet/ByJsonOrMnemonic/ByMnemonic/ByMnemonic'
// import Team from '@/components/Body/Team/Team'
// import PrivacyPolicy from '@/components/Body/PrivacyPolicy/PrivacyPolicy'
// import TermsOfConditions from '@/components/Body/TermsOfConditions/TermsOfConditions'
// import AccessMyWallet from '@/components/Body/AccessMyWallet/AccessMyWallet'
// import SendEthAndTokens from '@/components/Body/Transactions/SendEthAndTokens/SendEthAndTokens'
// import SendOffline from '@/components/Body/Transactions/SendOffline/SendOffline'
// import Swap from '@/components/Body/Transactions/Swap/Swap'
// import Dapps from '@/components/Body/Transactions/Dapps/Dapps'
// import RegisterDomainENS from '@/components/Body/Transactions/Dapps/RegisterDomainENS/RegisterDomainENS'
// import DomainSale from '@/components/Body/Transactions/Dapps/DomainSale/DomainSale'
// import InteractWithContract from '@/components/Body/Transactions/Contract/InteractWithContract/InteractWithContract'
// import InteractWithContract2 from '@/components/Body/Transactions/Contract/InteractWithContract2/InteractWithContract2'

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
    }
    // {
    //   path: '/interface',
    //   name: 'InterfaceLayout',
    //   component: InterfaceLayout
    // },
    // {
    //   path: '/swap',
    //   name: 'Swap',
    //   component: Swap
    // },
    // {
    //   path: '/dapps',
    //   name: 'Dapps',
    //   component: Dapps
    // },
    // {
    //   path: '/register-domain',
    //   name: 'RegisterDomainENS',
    //   component: RegisterDomainENS
    // },
    // {
    //   path: '/domain-sale',
    //   name: 'DomainSale',
    //   component: DomainSale
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
    // }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
})
