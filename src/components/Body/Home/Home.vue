<template>
  <div class="home">
    <vue-header></vue-header>
    <top-banner></top-banner>
    <about-mew></about-mew>
    <faqs></faqs>
    <news></news>
    <social></social>
    <promo></promo>
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
    // Scroll to top of the page
    window.scrollTo(0, 0)
  }
}
</script>

<style lang="scss" scoped>
  @import "Home.scss";
</style>
