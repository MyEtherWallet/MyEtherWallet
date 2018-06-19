<template>
  <div class="send-eth-and-tokens">
    <div class="wrap">
      <div class="side-nav">
        <interface-side-menu :currentTab="currentTab" :switchTabs="switchTabs"></interface-side-menu>
      </div>
      <div class="contents">
        <div class="tx-contents">
          <div>
            <interface-address />
          </div>
          <div>
            <interface-balance />
          </div>
          <div>
            <interface-network />
          </div>
          <send-currency-container v-show="currentTab === 'send' || currentTab === ''"></send-currency-container>
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
</template>

<script>
export default {
  data () {
    return {
      currentTab: 'send'
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
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceLayout.scss";
</style>
