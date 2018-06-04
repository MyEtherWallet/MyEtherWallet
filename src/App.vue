<template>
  <div id="app">
    <vue-header></vue-header>
    <router-view/>
    <vue-footer></vue-footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import "App.scss";
</style>
