<template>
  <div class="send-eth-and-tokens" v-if="$store.state.wallet !== null">
    <div class="wrap">
      <div class="side-nav">
        <interface-side-menu :currentTab="currentTab" :switchTabs="switchTabs"></interface-side-menu>
      </div>
      <div class="contents">
        <div class="tx-contents">
          <div>
            <interface-address :address="address" />
          </div>
          <div>
            <interface-balance :balance="balance"/>
          </div>
          <div>
            <interface-network :blockNumber="blockNumber" />
          </div>
          <send-currency-container :address="address" v-show="currentTab === 'send' || currentTab === ''"></send-currency-container>
          <send-offline-container v-show="currentTab === 'offline'"></send-offline-container>
          <swap-container v-show="currentTab === 'swap'"></swap-container>
          <dapps-container v-show="currentTab === 'dapps'"></dapps-container>
          <interact-with-contract-container v-show="currentTab === 'interactC'"></interact-with-contract-container>
          <deploy-contract-container v-show="currentTab === 'deployC'"></deploy-contract-container>
          <div class="tokens" v-if="$store.state.online">
            <interface-tokens></interface-tokens>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p> No wallet found </p>
    <div>
      Create Wallet | Access Wallet
    </div>
  </div>
</template>

<script>
import DappsContainer from '@/containers/DappsContainer'
import DeployContractContainer from '@/containers/DeployContractContainer'
import InteractWithContractContainer from '@/containers/InteractWithContractContainer'
import SendCurrencyContainer from '@/containers/SendCurrencyContainer'
import SendOfflineContainer from '@/containers/SendOfflineContainer'
import SwapContainer from '@/containers/SwapContainer'

import InterfaceAddress from './components/InterfaceAddress'
import InterfaceBalance from './components/InterfaceBalance'
import InterfaceNetwork from './components/InterfaceNetwork'
import InterfaceSideMenu from './components/InterfaceSideMenu'
import InterfaceTokens from './components/InterfaceTokens'

import store from 'store'

export default {
  components: {
    'send-currency-container': SendCurrencyContainer,
    'send-offline-container': SendOfflineContainer,
    'swap-container': SwapContainer,
    'dapps-container': DappsContainer,
    'interact-with-contract-container': InteractWithContractContainer,
    'deploy-contract-container': DeployContractContainer,
    'interface-side-menu': InterfaceSideMenu,
    'interface-address': InterfaceAddress,
    'interface-balance': InterfaceBalance,
    'interface-network': InterfaceNetwork,
    'interface-tokens': InterfaceTokens
  },
  data () {
    return {
      currentTab: this.$store.state.pageStates.interface.sideMenu,
      balance: '',
      blockNumber: ''
    }
  },
  methods: {
    switchTabs (param) {
      this.currentTab = param
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', param])
    },
    async getBlock () {
      const body = {
        'jsonrpc': '2.0',
        'method': 'eth_blockNumber',
        'params': [],
        'id': 0
      }
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }

      this.blockNumber = await fetch('https://api.myetherwallet.com/eth', config).then((res) => {
        return res.json()
      }).catch((err) => {
        console.log(err)
      })
    },
    async getBalance () {
      const body = {
        'jsonrpc': '2.0',
        'method': 'eth_getBalance',
        'params': [this.address, 'latest'],
        'id': 0
      }
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
      this.balance = await fetch('https://api.myetherwallet.com/eth', config).then((res) => {
        return res.json()
      }).catch((err) => {
        console.log(err)
      })

      this.$store.dispatch('setAccountBalance', this.balance)
    }
  },
  mounted () {
    if (store.get('curPage') !== undefined) {
      this.curPage = store.get('curPage')
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', store.get('curPage')])
    }

    if (this.$store.state.wallet !== null && this.$store.state.wallet !== undefined) {
      this.getBalance()
    }

    setInterval(this.getBlock, 14000)
  },
  computed: {
    address () {
      return this.$store.state.wallet.getAddressString()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceLayout.scss";
</style>
