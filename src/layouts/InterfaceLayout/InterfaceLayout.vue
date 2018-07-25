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
          <send-currency-container :tokensWithBalance="tokensWithBalance" :address="address" v-show="currentTab === 'send' || currentTab === ''"></send-currency-container>
          <send-offline-container v-show="currentTab === 'offline'"></send-offline-container>
          <swap-container v-show="currentTab === 'swap'"></swap-container>
          <dapps-container v-show="currentTab === 'dapps'"></dapps-container>
          <interact-with-contract-container v-show="currentTab === 'interactC'"></interact-with-contract-container>
          <deploy-contract-container v-show="currentTab === 'deployC'"></deploy-contract-container>
          <div class="tokens" v-if="$store.state.online">
            <interface-tokens :tokens="tokens" :receivedTokens="receivedTokens"></interface-tokens>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <wallet-not-found-container></wallet-not-found-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTokensHex } from '@/helpers'

import DappsContainer from './containers/DappsContainer'
import DeployContractContainer from './containers/DeployContractContainer'
import InteractWithContractContainer from './containers/InteractWithContractContainer'
import SendCurrencyContainer from './containers/SendCurrencyContainer'
import SendOfflineContainer from './containers/SendOfflineContainer'
import SwapContainer from './containers/SwapContainer'
import WalletNotFoundContainer from './containers/WalletNotFoundContainer'

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
    'interface-tokens': InterfaceTokens,
    'wallet-not-found-container': WalletNotFoundContainer
  },
  data () {
    return {
      currentTab: this.$store.state.pageStates.interface.sideMenu,
      balance: '',
      blockNumber: '',
      tokens: [],
      receivedTokens: false,
      tokensWithBalance: []
    }
  },
  methods: {
    switchTabs (param) {
      this.currentTab = param
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', param])
      store.set('sideMenu', param)
    },
    async fetchTokens () {
      if (this.network.type.name === 'ETH') {
        this.receivedTokens = true
        const toAddress = '0xBE1ecF8e340F13071761e0EeF054d9A511e1Cb56'
        const userAddress = this.$store.state.wallet
          .getAddress()
          .toString('hex')
        const data = `0x80f4ae5c000000000000000000000000${userAddress}0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000`

        const body = {
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [{ to: toAddress, data: data }, 'pending'],
          id: 0
        }

        const config = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }

        const response = await fetch(this.network.url, config)
          .then(res => {
            return res.json()
          })
          .catch(err => {
            console.log(err)
          })
        return response
      } else {
        this.receivedTokens = false
        return this.network.type.tokens
      }
    },
    async setTokens () {
      const hex = await this.fetchTokens()
      if (this.tokens.length === 0) {
        this.tokens = parseTokensHex(hex.result).sort((a, b) => {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1
          } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1
          } else {
            return 0
          }
        })

        this.tokensWithBalance = this.tokens.filter(token => token.balance > 0)
      }
    },
    async getBlock () {
      const body = {
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 0
      }
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }

      this.blockNumber = await fetch(this.network.url, config)
        .then(res => {
          return res.json()
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getBalance () {
      const body = {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [this.address, 'latest'],
        id: 0
      }
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
      this.balance = await fetch(this.network.url, config)
        .then(res => {
          this.getNonce()
          return res.json()
        })
        .catch(err => {
          console.log(err)
        })

      this.$store.dispatch('setAccountBalance', this.balance)
    },
    async getNonce () {
      const body = {
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [this.address, 'latest'],
        id: 0
      }
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
      const nonce = await fetch(this.network.url, config)
        .then(res => {
          return res.json()
        })
        .catch(err => {
          console.log(err)
        })

      this.$store.dispatch('setAccountNonce', Number(nonce.result))
    }
  },
  mounted () {
    if (store.get('sideMenu') !== undefined) {
      this.currentTab = store.get('sideMenu')
      this.$store.dispatch('updatePageState', ['interface', 'sideMenu', store.get('sideMenu')])
    }

    if (this.$store.state.online === true) {
      if (this.$store.state.wallet !== null) {
        this.getBalance()
        setInterval(this.getBlock, 14000)
        if (this.network.type.chainID === 1) {
          this.setTokens()
        }
      }
    }
  },
  computed: {
    address () {
      if (this.$store.state.wallet !== null) {
        return this.$store.state.wallet.getAddressString()
      }
    },
    ...mapGetters({
      network: 'network'
    })
  },
  watch: {
    network (newVal) {
      if (this.$store.state.online === true) {
        if (this.$store.state.wallet !== null) {
          this.getBalance()
          this.getNonce()
          this.getBlock()
          setInterval(this.getBlock, 14000)
          if (this.network.type.chainID === 1) {
            this.setTokens()
          }
        }
      }
    },
    tokens (newVal) {
      this.tokens = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
@import "InterfaceLayout.scss";
</style>
