<template>
  <div class="home">
    <vue-header></vue-header>
    <top-banner></top-banner>
    <about-mew class="homepage-about"></about-mew>
    <faqs class="homepage-faqs"></faqs>
    <news class="homepage-news"></news>
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
    // Scroll to Menu link
    var targetEl = document.querySelector('.' + this.$store.state.state.homepage.sublink)
    if (targetEl) {
      targetEl.scrollIntoView()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "Home.scss";
</style>
