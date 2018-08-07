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
import Web3 from 'web3'

export default {
  name: 'App',
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer
  },
  mounted () { // Can't use before mount because that lifecycle isn't called if serving via static files
    const state = {
      web3: store.get('network') ? new Web3(new Web3.providers.HttpProvider(store.get('network').url)) : new Web3(new Web3.providers.HttpProvider(this.$store.state.Networks['ETH'][0].url)),
      network: store.get('network') !== undefined ? store.get('network') : this.$store.state.Networks['ETH'][0],
      wallet: null,
      account: {
        balance: 0
      },
      Transactions: {},
      Networks: nodeList,
      Errors: {},
      online: true,
      pageStates: {
        interface: {
          sideMenu: store.get('sideMenu') !== undefined ? store.get('sideMenu') : 'send'
        }
      },
      notifications: store.get('notifications') !== undefined ? store.get('notifications') : {},
      gasPrice: store.get('gasPrice') !== undefined ? store.get('gasPrice') : 41
    }

    this.$store.dispatch('setState', state)
    this.$store.dispatch('checkIfOnline')
  }
}
</script>

<style lang="scss">
  @import "App.scss";
</style>
