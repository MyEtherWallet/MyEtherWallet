<template>
  <div class="light-blue darken-4 top-banner">
    <div class="banner-container pointer-event--none user-select--none">
      <img
        class="banner-img"
        src="@/assets/images/banners/homepage-top-banner.svg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeContainer'
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';

.banner-container {
  overflow: hidden;
}

.banner-img {
  margin-top: -160px;
  width: 100%;
}
</style>
