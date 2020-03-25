<template>
  <div
    class="d-flex align-center py-4 px-10 footer-container"
    :style="{
      boxShadow: '0 0 15px' + $vuetify.theme.themes[theme].componentShadowColor1
    }"
  >
    <div class="mew-copyright">
      ©2020 MyEtherWallet. All rights reserved. Pricing taken from
      <a href="/" targe="_blank">CoinMarketCap</a>
    </div>
    <div class="ml-auto d-flex align-center">
      <div>Feedback</div>
      <div class="mx-4">|</div>
      <div>Support</div>
      <div class="mx-4">|</div>
      <div>English <v-icon>mdi-chevron-down</v-icon></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
.mew-copyright {
  color: #999999;
  a {
    text-decoration: none;
    color: $dark-sacramento !important;
  }
}
</style>
