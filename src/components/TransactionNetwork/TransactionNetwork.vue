<template>
  <div class="transaction-info-blocks">
    <div class="wrap">

      <div class="info-block network">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/network.svg">
        </div>
        <div class="block-content">
          <h2>Network</h2>
          <h4>myetherapi.com(ETH)</h4>
          <p class="bottom-button">Change <i class="fa fa-chevron-right" aria-hidden="true"></i></p>
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
  @import "TransactionNetwork.scss";
</style>
