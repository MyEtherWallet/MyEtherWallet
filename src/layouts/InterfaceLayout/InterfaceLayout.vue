<template>
  <div class="send-eth-and-tokens" v-if="address !== ''">
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
          <dapps-container v-show="currentTab === 'dapps'"></dapps-container>
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
export default {
  data () {
    return {
      currentTab: 'send',
      address: '',
      balance: '',
      blockNumber: ''
    }
  },
  methods: {
    switchTabs: function (param) {
      const self = this
      self.currentTab = param
    },
    getBlock: async function () {
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
    getBalance: async function () {
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
    }
  },
  mounted: function () {
    const self = this
    if (window.localStorage.getItem('curPage') !== undefined) {
      self.currentTab = window.localStorage.getItem('curPage')
    }

    if (self.$store.state.wallet !== null && self.$store.state.wallet !== undefined) {
      self.address = '0x' + self.$store.state.wallet.getAddress().toString('hex')
      self.getBalance()
    }

    setInterval(self.getBlock, 14000)
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceLayout.scss";
</style>
