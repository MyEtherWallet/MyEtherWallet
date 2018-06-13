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
  mounted: function () {
    const self = this
    if (self.$store.getters.all.online) {
      self.online = true
    } else {
      self.online = false
    }
  },
  watch: {
    online: function (newVal) {
      const self = this
      self.online = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "HomeLayout.scss";
</style>
