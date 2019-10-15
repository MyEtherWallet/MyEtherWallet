<template>
  <div class="banner-container">
    <img class="banner" src="~@/assets/images/banners/bg.png" />
    <div class="banner-text">{{ bannerText }}</div>
  </div>
</template>

<script>
export default {
  props: {
    bannerText: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'BannerComponent.scss';
</style>
