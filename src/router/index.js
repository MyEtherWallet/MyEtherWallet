import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Body/Home/Home'
import CreateWallet from '@/components/Body/CreateWallet/ByJsonOrMnemonic/YourPassword/YourPassword'
import ByJsonFile from '@/components/Body/CreateWallet/ByJsonOrMnemonic/ByJsonFile/ByJsonFile'
import ByMnemonic from '@/components/Body/CreateWallet/ByJsonOrMnemonic/ByMnemonic/ByMnemonic'
import Neo from '@/components/Body/Neo/NeoWalletComponent'
import Eth from '@/components/Body/Eth/EthWalletComponent'
import Team from '@/components/Body/Team/Team'
import PrivacyPolicy from '@/components/Body/PrivacyPolicy/PrivacyPolicy'
import TermsOfConditions from '@/components/Body/TermsOfConditions/TermsOfConditions'
import AccessMyWallet from '@/components/Body/AccessMyWallet/AccessMyWallet'
import SendEthAndTokens from '@/components/Body/Transactions/SendEthAndTokens/SendEthAndTokens'
import Luv from '@/components/Body/Tokhn/LuvWalletComponent'
import SendOffline from '@/components/Body/Transactions/SendOffline/SendOffline'
import Swap from '@/components/Body/Transactions/Swap/Swap'
import Dapps from '@/components/Body/Transactions/Dapps/Dapps'
import RegisterDomainENS from '@/components/Body/Transactions/Dapps/RegisterDomainENS/RegisterDomainENS'
import DomainSale from '@/components/Body/Transactions/Dapps/DomainSale/DomainSale'
import InteractWithContract from '@/components/Body/Transactions/Contract/InteractWithContract/InteractWithContract'
import InteractWithContract2 from '@/components/Body/Transactions/Contract/InteractWithContract2/InteractWithContract2'

Vue.use(Router)

export default new Router({
  routes: [
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
      path: '/neo',
      name: 'Neo',
      component: Neo
    },
    {
      path: '/luv',
      name: 'Luv',
      component: Luv
    },
    {
      path: '/eth',
      name: 'Eth',
      component: Eth
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
    }
  ]
})
