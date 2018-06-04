<template>
  <div class="transaction-info-blocks">
    <div class="wrap">

      <div class="info-block network">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/network.svg">
        </div>
        <div class="block-content">
          <h2>Network</h2>
          <p>myetherapi.com(ETH)</p>
          <p>Last Block#: 5699679</p>
          <div class="icon-container">
            <img src="~@/assets/images/icons/change.svg">
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
  @import "TransactionNetwork.scss";
</style>
