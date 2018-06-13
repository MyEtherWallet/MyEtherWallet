<template>
  <div id="app">
    <header-container />
    <router-view/>
    <footer-container />
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeMount: function () {
    this.$store.dispatch('checkIfOnline')
  }
}
</script>

<style lang="scss">
  @import "App.scss";
</style>
