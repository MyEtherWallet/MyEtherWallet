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
            <interface-balance />
          </div>
          <div>
            <interface-network />
          </div>
          <send-currency-container :address="address" v-show="currentTab === 'send' || currentTab === ''"></send-currency-container>
          <send-offline-container v-show="currentTab === 'offline'"></send-offline-container>
          <swap-container v-show="currentTab === 'swap'"></swap-container>
          <dapps-container v-show="currentTab === 'dapps'"></dapps-container>
          <deploy-contract-container v-show="currentTab === 'deployC'"></deploy-contract-container>
          <interact-with-contract-container v-show="currentTab === 'interactC'"></interact-with-contract-container>
          <dapps-container v-show="currentTab === 'dapps'"></dapps-container>
          <div class="tokens" v-if="$store.getters.all.online">
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
      address: ''
    }
  },
  methods: {
    switchTabs: function (param) {
      const self = this
      self.currentTab = param
    }
  },
  mounted: function () {
    const self = this
    if (window.localStorage.getItem('curPage') !== undefined) {
      self.currentTab = window.localStorage.getItem('curPage')
    }

    if (self.$store.getters.all.wallet !== null && self.$store.getters.all.wallet !== undefined) {
      self.address = '0x' + self.$store.getters.all.wallet.getAddress().toString('hex')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceLayout.scss";
</style>
