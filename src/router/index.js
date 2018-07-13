import Vue from 'vue'
import Router from 'vue-router'

import DevelopmentElements from '@/components/Development/Elements/Elements'

import Home from '@/components/Body/Home/Home'
import CreateWallet from '@/components/Body/CreateWallet/ByJsonOrMnemonic/YourPassword/YourPassword'
import ByJsonFile from '@/components/Body/CreateWallet/ByJsonOrMnemonic/ByJsonFile/ByJsonFile'
import ByMnemonic from '@/components/Body/CreateWallet/ByJsonOrMnemonic/ByMnemonic/ByMnemonic'
import Team from '@/components/Body/Team/Team'
import PrivacyPolicy from '@/components/Body/PrivacyPolicy/PrivacyPolicy'
import TermsOfConditions from '@/components/Body/TermsOfConditions/TermsOfConditions'
import AccessMyWallet from '@/components/Body/AccessMyWallet/AccessMyWallet'
import SendEthAndTokens from '@/components/Body/Transactions/SendEthAndTokens/SendEthAndTokens'
import SendOffline from '@/components/Body/Transactions/SendOffline/SendOffline'
import Swap from '@/components/Body/Transactions/Swap/Swap'
import Dapps from '@/components/Body/Transactions/Dapps/Dapps'
import RegisterDomainENS from '@/components/Body/Transactions/Dapps/RegisterDomainENS/RegisterDomainENS'
import DomainSale from '@/components/Body/Transactions/Dapps/DomainSale/DomainSale'
import InteractWithContract from '@/components/Body/Transactions/Contract/InteractWithContract/InteractWithContract'
import InteractWithContract2 from '@/components/Body/Transactions/Contract/InteractWithContract2/InteractWithContract2'
import DeployContract from '@/components/Body/Transactions/Contract/DeployContract/DeployContract'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dev/elements',
      name: 'DevelopmentElements',
      component: DevelopmentElements
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/create-wallet',
      name: 'CreateWallet',
      component: CreateWallet
    },
    {
      path: '/by-json-file',
      name: 'ByJsonFile',
      component: ByJsonFile
    },
    {
      path: '/by-mnemonic-phrase',
      name: 'ByMnemonic',
      component: ByMnemonic
    },
    {
      path: '/team',
      name: 'Team',
      component: Team
    },
    {
      path: '/privacy-policy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy
    },
    {
      path: '/terms-of-conditions',
      name: 'TermsOfConditions',
      component: TermsOfConditions
    },
    {
      path: '/access-my-wallet',
      name: 'AccessMyWallet',
      component: AccessMyWallet
    },
    {
      path: '/send-eth-and-tokens',
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
    },
    {
      path: '/interact-with-contract',
      name: 'InteractWithContract',
      component: InteractWithContract
    },
    {
      path: '/interact-with-contract2',
      name: 'InteractWithContract2',
      component: InteractWithContract2
    },
    {
      path: '/deploy-contract',
      name: 'DeployContract',
      component: DeployContract
    }
  ]
})
