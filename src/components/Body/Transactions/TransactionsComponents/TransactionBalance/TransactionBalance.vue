<template>
  <div class="transaction-info-blocks">
    <div class="wrap">

      <div class="info-block balance">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/balance.svg">
        </div>
        <div class="block-content">
          <h2>Balance</h2>
          <h4>7130.000000 ETH</h4>
          <div class="icon-container">
            <img src="~@/assets/images/icons/more.svg">
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionBalance.scss";
</style>
