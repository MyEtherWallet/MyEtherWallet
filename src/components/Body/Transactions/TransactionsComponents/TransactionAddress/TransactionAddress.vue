<template>
  <div class="transaction-address">
    <div class="wrap">

      <div class="info-block address">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/avatar.svg">
        </div>
        <div class="block-content">
          <h2>Address</h2>
          <p class="address">0xe5cD582F564991F83bE7A5b3ba<br>742cb4ff5c6FE2</p>
          <div class="icon-container small-tooltop-1">
            <div class="tooltip-block">
              <div v-b-tooltip.hover title="Print" class="custom-tooltip">
                <img src="~@/assets/images/icons/printer-white.svg">
              </div>
            </div>
            <div class="tooltip-block">
              <div v-b-tooltip.hover title="Copy" class="custom-tooltip">
                <img src="~@/assets/images/icons/copy.svg">
              </div>
            </div>
            <div class="tooltip-block">
              <div v-b-tooltip.hover title="Refresh" class="custom-tooltip">
                <img src="~@/assets/images/icons/change.svg">
              </div>
            </div>
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
  @import "TransactionAddress.scss";
</style>
