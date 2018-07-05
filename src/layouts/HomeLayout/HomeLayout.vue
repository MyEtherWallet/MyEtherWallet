<template>
  <div class="home">
    <top-banner></top-banner>
    <about></about>
    <faqs></faqs>
    <news v-show="online"></news>
    <social></social>
    <promo></promo>
  </div>
</template>

<script>
export default {
  name: 'HomeContainer',
  data () {
    return {
      online: true
    }
  },
  mounted () {
    if (this.$store.state.online) {
      this.online = true
    } else {
      this.online = false
    }
  },
  watch: {
    online (newVal) {
      this.online = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "HomeLayout.scss";
</style>
