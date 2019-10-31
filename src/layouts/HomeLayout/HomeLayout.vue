<template>
  <div class="light-blue darken-4 home-layout">
    <TopBanner />
  </div>
</template>

<script>
import TopBanner from './components/TopBanner';

export default {
  name: 'HomeContainer',
  components: {
    TopBanner
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

.home-layout {
}
</style>
