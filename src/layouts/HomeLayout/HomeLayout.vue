<template>
  <div>
    <div class="light-blue darken-4 home-layout">
      <TopBanner />
    </div>
    <Features class="py-12" />
    <WhyMew />
    <Ad1 class="py-12" />
    <Partners class="py-12" />
    <Ad2 class="mt-4" />
  </div>
</template>

<script>
import TopBanner from './components/TopBanner';
import Features from './components/Features';
import WhyMew from './components/WhyMew';
import Ad1 from './components/Ad1';
import Ad2 from './components/Ad2';
import Partners from './components/Partners';

export default {
  name: 'HomeLayout',
  components: {
    TopBanner,
    Features,
    WhyMew,
    Ad1,
    Ad2,
    Partners
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables';
</style>
