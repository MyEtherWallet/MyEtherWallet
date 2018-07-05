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
  beforeMount: function () {
    this.$store.dispatch('checkIfOnline')
  }
}
</script>

<style lang="scss">
  @import "App.scss";
</style>
