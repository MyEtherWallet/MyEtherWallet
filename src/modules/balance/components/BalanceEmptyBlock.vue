<template>
  <v-sheet
    class="module-no-balance pa-4 py-7 pa-sm-12"
    color="white"
    max-width="100%"
  >
    <h2 class="mb-6">My {{ networkType }} balance is empty</h2>
    <mew-button
      :has-full-width="false"
      title="Buy ETH with a credit card"
      btn-size="xlarge"
      btn-link="https://ccswap.myetherwallet.com/#/"
    />
    <div class="d-flex align-center mt-5">
      <div>We accept credit card</div>
      <img
        v-if="!$vuetify.theme.dark"
        class="ml-2 mr-1"
        height="21"
        src="@/assets/images/icons/icon-visa-dark.png"
      />
      <img
        v-if="$vuetify.theme.dark"
        class="ml-2 mr-2"
        height="13"
        src="@/assets/images/icons/icon-visa-white.png"
      />
      <img height="18" src="@/assets/images/icons/icon-mastercard-mew.png" />
    </div>
    <div class="textSecondary--text mt-12">
      Tip: You can also send your ETH from another wallet!
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: 'BalanceEmptyBlock',
  props: {
    networkType: {
      type: String,
      default: ''
    }
  }
};
</script>

<style class="scss">
.module-no-balance {
  background-image: url(~@/assets/images/backgrounds/bg-circle-triangle.png);
  background-position: right 60px bottom -1px;
  background-size: 180px;
  border-radius: 12px !important;
  left: 0;
  top: 0;
  width: 100%;
  box-shadow: 0 12px 17px rgb(21 29 63 / 3%) !important;
  min-height: 360px;
}
</style>
