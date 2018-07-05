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

export default {
  name: 'App',
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer
  },
  beforeMount () {
    this.$store.dispatch('checkIfOnline')
    if (window.web3) {
      this.$store.dispatch('setWeb3Instance', window.web3)
    }
  },
  mounted () {
    console.log(this)
  }
}
</script>

<style lang="scss">
  @import "App.scss";
</style>
