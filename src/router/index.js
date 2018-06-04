import Vue from 'vue'
import Router from 'vue-router'
import HomeContainer from '@/containers/HomeContainer'
import CreateWalletContainer from '@/containers/CreateWalletContainer'
import ByJsonFileContainer from '@/containers/ByJsonFileContainer'
import ByMnemonicContainer from '@/containers/ByMnemonicContainer'
import TeamContainer from '@/containers/TeamContainer'
import PrivacyPolicyContainer from '@/containers/PrivacyPolicyContainer'
import TermsOfConditionsContainer from '@/containers/TermsOfConditionsContainer'
import AccessWalletContainer from '@/containers/AccessWalletContainer'
import SendTransactionContainer from '@/containers/SendTransactionContainer'

// CLEANUP
import SendEthAndTokens from '@/components/Body/Transactions/SendEthAndTokens/SendEthAndTokens'
import SendOffline from '@/components/Body/Transactions/SendOffline/SendOffline'
import Swap from '@/components/Body/Transactions/Swap/Swap'
import Dapps from '@/components/Body/Transactions/Dapps/Dapps'
import RegisterDomainENS from '@/components/Body/Transactions/Dapps/RegisterDomainENS/RegisterDomainENS'
import DomainSale from '@/components/Body/Transactions/Dapps/DomainSale/DomainSale'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeContainer
    },
    {
      path: '/create-wallet',
      name: 'CreateWalletContainer',
      component: CreateWalletContainer
    },
    {
      path: '/by-json-file',
      name: 'ByJsonFileContainer',
      component: ByJsonFileContainer
    },
    {
      path: '/by-mnemonic-phrase',
      name: 'ByMnemonicContainer',
      component: ByMnemonicContainer
    },
    {
      path: '/team',
      name: 'TeamContainer',
      component: TeamContainer
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicyContainer',
      component: PrivacyPolicyContainer
    },
    {
      path: '/terms-of-conditions',
      name: 'TermsOfConditionsContainer',
      component: TermsOfConditionsContainer
    },
    {
      path: '/access-my-wallet',
      name: 'AccessMyWallet',
      component: AccessWalletContainer
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
  ]
})
