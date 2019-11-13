<template>
  <div class="mobile-menu d-flex">
    <div class="d-flex logo-block">
      <img
        :src="require(`@/assets/images/short-hand-logo-mewcx.png`)"
        alt
        height="60"
      />
      <p>Chrome Extension</p>
    </div>
    <div class="spacer"></div>
    <div class="d-flex">
      <div class="d-flex">
        <img
          alt
          class="buy-eth-icon"
          src="@/assets/images/icons/buy-eth.svg"
          height="24"
        />
        <p>Buy ETH</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'CxMenu.scss';
</style>
