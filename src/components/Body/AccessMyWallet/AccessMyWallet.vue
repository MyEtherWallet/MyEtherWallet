<template>
  <div class="home">
    <vue-header></vue-header>
    <access-my-wallet-options></access-my-wallet-options>
    <price-bar></price-bar>
    <faqs></faqs>
    <vue-footer></vue-footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    // Scroll to top
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="scss" scoped>
  @import "AccessMyWallet.scss";
</style>
