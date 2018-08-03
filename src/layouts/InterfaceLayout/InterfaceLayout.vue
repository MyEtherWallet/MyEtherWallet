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
          <sign-message-container v-show="currentTab === 'signMessage'"></sign-message-container>
          <verify-message-container v-show="currentTab === 'verifyMessage'"></verify-message-container>
          <deploy-contract-container v-show="currentTab === 'deployC'"></deploy-contract-container>
          <div class="tokens" v-if="$store.state.online">
            <interface-tokens :getTokenBalance="getTokenBalance" :tokens="tokens" :receivedTokens="receivedTokens"></interface-tokens>
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
import SignMessageContainer from './containers/SignMessageContainer'
import VerifyMessageContainer from './containers/VerifyMessageContainer'
import WalletNotFoundContainer from './containers/WalletNotFoundContainer'

import InterfaceAddress from './components/InterfaceAddress'
import InterfaceBalance from './components/InterfaceBalance'
import InterfaceNetwork from './components/InterfaceNetwork'
import InterfaceSideMenu from './components/InterfaceSideMenu'
import InterfaceTokens from './components/InterfaceTokens'

import store from 'store'
// eslint-disable-next-line
const unit = require('ethjs-unit')

export default {
  components: {
    'send-currency-container': SendCurrencyContainer,
    'send-offline-container': SendOfflineContainer,
    'swap-container': SwapContainer,
    'dapps-container': DappsContainer,
    'interact-with-contract-container': InteractWithContractContainer,
    'deploy-contract-container': DeployContractContainer,
    'sign-message-container': SignMessageContainer,
    'verify-message-container': VerifyMessageContainer,
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
        const data = `0x80f4ae5c000000000000000000000000${this.$store.state.wallet.getAddress().toString('hex')}0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000`
        const response = this.$store.state.web3.eth.call({
          to: '0xBE1ecF8e340F13071761e0EeF054d9A511e1Cb56',
          data: data
        }).then(response => {
          return response
        }).catch(err => {
          console.log(err)
        })

        return response
      } else {
        this.receivedTokens = false
        return this.network.type.tokens
      }
    },
    async getTokenBalance (address) {
      const web3 = this.$store.state.web3
      const contractAbi = [{'name': 'balanceOf', 'type': 'function', 'constant': true, 'inputs': [{ 'name': 'address', 'type': 'address' }], 'outputs': [{ 'name': 'out', 'type': 'uint256' }]}]
      const contract = new web3.eth.Contract(contractAbi)
      const data = contract.methods.balanceOf(this.$store.state.wallet.getAddressString()).encodeABI()
      return web3.eth.call({
        to: web3.utils.toChecksumAddress(address),
        data: data
      }).then(res => unit.fromWei(web3.utils.toBN(res).toString(), 'ether')).catch(err => console.log(err))
    },
    async setTokens () {
      const hex = await this.fetchTokens()
      if (this.tokens.length === 0) {
        this.tokens = parseTokensHex(hex).sort((a, b) => {
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
    getBlock () {
      this.$store.state.web3.eth.getBlockNumber().then((res) => {
        this.blockNumber = res
      }).catch(err => console.log(err))
    },
    getBalance () {
      this.$store.state.web3.eth.getBalance(this.address).then((res) => {
        this.balance = res
        this.$store.dispatch('setAccountBalance', this.balance)
      }).catch(err => console.log(err))
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
      const self = this
      if (this.$store.state.online === true) {
        if (this.$store.state.wallet !== null) {
          this.getBalance()
          this.getBlock()
          setInterval(this.getBlock, 14000)
          if (this.network.type.chainID === 1) {
            this.setTokens()
          } else {
            this.tokens = this.network.type.tokens.map(token => {
              token.balance = self.getTokenBalance(token.address)
            })
            this.receivedTokens = false
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
