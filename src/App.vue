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
  mounted: function () {
    this.$store.commit('CHECK_IF_ONLINE')
  }
}
</script>

<style lang="scss">
  @import "App.scss";
</style>
