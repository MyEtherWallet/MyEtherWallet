<template>
  <div class="home-layout">
    <div class="light-blue darken-4 home-layout">
      <TopBanner />
    </div>
    <Features class="py-12" />
    <WhyMew />
  </div>
</template>

<script>
import TopBanner from './components/TopBanner';
import Features from './components/Features';
import WhyMew from './components/WhyMew';

export default {
  name: 'HomeLayout',
  components: {
    TopBanner,
    Features,
    WhyMew
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';
</style>
