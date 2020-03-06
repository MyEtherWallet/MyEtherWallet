<template>
  <v-sheet
    tile
    color="white"
    class="d-flex align-center py-4 px-10 footer-container"
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
  </v-sheet>
</template>

<script>
export default {
  components: {}
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
.footer-container {
  box-shadow: 0 0 20px #0000000f;
}

.mew-copyright {
  color: #999999;
  a {
    text-decoration: none;
    color: $dark-sacramento !important;
  }
}
</style>
