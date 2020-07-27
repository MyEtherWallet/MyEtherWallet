<template>
  <mew-button
    class="buy-eth-button"
    color-theme="white"
    btn-style="outline"
    title="Buy ETH here"
    button-size="large"
    :icon="require('@/assets/images/icons/icon-mastercard-mew.png')"
    icon-type="img"
    icon-align="right"
  />
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  }
};
</script>
<style lang="scss">
.buy-eth-button {
  img {
    height: 20px !important;
  }
}
</style>
