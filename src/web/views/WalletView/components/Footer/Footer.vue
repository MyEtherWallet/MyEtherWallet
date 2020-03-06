<template>
  <v-sheet color="transparent" class="d-flex align-center">
    <div class="mew-copyright">
      ©2020 MyEtherWallet. All rights reserved. Pricing taken from
      <a href="/" targe="_blank">CoinMarketCap</a>
    </div>
    <div class="ml-auto d-flex align-center">
      <div>Feedback</div>
      <div class="mx-4">|</div>
      <div>Support</div>
      <div class="mx-4">|</div>
      <div>English <v-icon class="body-1">mdi-chevron-down</v-icon></div>
    </div>
  </v-sheet>
</template>

<script>
export default {
  components: {}
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
.body-1 {
  line-height: 1rem !important;
}
</style>