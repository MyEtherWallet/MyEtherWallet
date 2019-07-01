<template>
  <div class="amount-info-container">
    <div class="eth-icon">
      <img src="@/assets/images/currency/eth.svg" />
    </div>
    <div class="amount-text-container">
      <p class="amount-text">{{ amount }} <span>ETH</span></p>
      <p>Address: {{ address | concatAddr }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    address: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: '0'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "AmountInfoComponent.scss";
</style>
