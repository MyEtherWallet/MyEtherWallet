<template>
  <div class="sign-transaction-container">
    <div class="sign-transaction-header">
      <p>Confirmation</p>
    </div>
    <div class="sign-transaction-addresses">
      <amount-info-component />
      <img src="@/assets/images/icons/arrow-down-blue.svg" />
      <amount-info-component />
    </div>
    <div class="details-container">
      <div class="details-header-container">
        <h3>Details</h3>
      </div>
    </div>
  </div>
</template>

<script>
import AmountInfoComponent from './components/AmountInfoComponent';
export default {
  components: {
    'amount-info-component': AmountInfoComponent
  }
};
</script>

<style lang="scss" scoped>
@import 'SignTxContainer.scss';
</style>
