<template>
  <div class="home">
    <top-banner></top-banner>
    <about></about>
    <faqs></faqs>
    <news v-if="$store.getters.all.online"></news>
    <social></social>
    <promo></promo>
  </div>
</template>

<script>
export default {
  name: 'HomeContainer',
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "HomeLayout.scss";
</style>
