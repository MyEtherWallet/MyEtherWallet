<template>
  <div class="home">
    <TopBanner></TopBanner>
    <AboutMEW></AboutMEW>
    <FAQs></FAQs>
    <News></News>
    <Social></Social>
    <Promo></Promo>
  </div>
</template>

<script>
import AboutMEW from '@/components/Body/Home/AboutMEW/AboutMEW'
import FAQs from '@/components/Body/Home/FAQs/FAQs'
import News from '@/components/Body/Home/News/News'
import Promo from '@/components/Body/Home/Promo/Promo'
import Social from '@/components/Body/Home/Social/Social'
import TopBanner from '@/components/Body/Home/TopBanner/TopBanner'

export default {
  components: {
    AboutMEW,
    FAQs,
    News,
    Promo,
    Social,
    TopBanner
  },
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "HomeContainer.scss";
</style>
