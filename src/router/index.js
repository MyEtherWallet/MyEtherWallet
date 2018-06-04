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
    }
  ]
})
