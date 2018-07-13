<template>
  <div id="app">
    <header-container />
    <router-view/>
    <footer-container />
  </div>
</template>

<script>
import FooterContainer from '@/containers/FooterContainer'
import HeaderContainer from '@/containers/HeaderContainer'
import store from 'store'
import nodeList from '@/configs/networks'

export default {
  name: 'App',
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer
  },
  mounted () {
    const state = {
      web3: {},
      network: store.get('network') !== undefined ? store.get('network') : this.$store.Networks.ETH[0],
      wallet: null,
      account: {
        balance: 0,
        nonce: null
      },
      Transactions: {},
      Networks: nodeList,
      Errors: {},
      online: true,
      pageStates: {
        interface: {
          sendOffline: store.get('sendOffline'),
          sideMenu: store.get('sideMenu') !== undefined ? store.get('sideMenu') : 'send'
        }
      },
      txSpeed: store.get('txSpeed') !== undefined ? store.get('txSpeed') : 41
    }

    this.$store.dispatch('setState', state)
    this.$store.dispatch('checkIfOnline')
    if (window.web3) {
      this.$store.dispatch('setWeb3Instance', window.web3)
    }
  }
}
</script>

<style lang="scss">
  @import "App.scss";
</style>
