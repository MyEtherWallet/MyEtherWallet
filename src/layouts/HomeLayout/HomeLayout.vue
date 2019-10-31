<template>
  <div class="home-layout">
    <div class="light-blue darken-4 home-layout">
      <TopBanner />
    </div>
    <Features />
  </div>
</template>

<script>
import TopBanner from './components/TopBanner';
import Features from './components/Features';

export default {
  name: 'HomeLayout',
  components: {
    TopBanner,
    Features
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';
</style>
