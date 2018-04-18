<template>
  <div class="home">
    <div class="page-container">
      <vue-header></vue-header>
      <top-banner></top-banner>
    </div>

    <about-mew></about-mew>

    <div class="page-container">
      <faqs></faqs>
    </div>

    <news></news>

    <div class="page-container">
      <vue-footer></vue-footer>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "Home.scss";
</style>
