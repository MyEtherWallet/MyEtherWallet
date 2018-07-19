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
import AboutContainer from '@/containers/AboutContainer'
import FaqsContainer from '@/containers/FaqsContainer'
import NewsContainer from '@/containers/NewsContainer'
import Promo from './components/Promo'
import Social from './components/Social'
import TopBanner from './components/TopBanner'

export default {
  name: 'HomeContainer',
  components: {
    'top-banner': TopBanner,
    'about': AboutContainer,
    'faqs': FaqsContainer,
    'news': NewsContainer,
    'social': Social,
    'promo': Promo
  },
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
