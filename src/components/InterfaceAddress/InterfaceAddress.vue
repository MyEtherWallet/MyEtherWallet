<template>
  <div class="transaction-address">
    <div class="wrap">

      <div class="info-block address">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/avatar.svg">
        </div>
        <div class="block-content">
<<<<<<< HEAD:src/components/InterfaceAddress/InterfaceAddress.vue
          <h2>{{ $t("reused.address")}}</h2>
          <p class="address">{{address}}</p>
          <div class="icon-container">
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/printer-white.svg">
            </b-btn>
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/copy.svg">
            </b-btn>
            <b-btn v-b-tooltip.hover title="I'm a tooltip!" class="custom-tooltip">
              <img src="~@/assets/images/icons/change.svg">
            </b-btn>
=======
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
>>>>>>> master:src/components/Body/Transactions/TransactionsComponents/TransactionAddress/TransactionAddress.vue
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['address']
}
</script>

<style lang="scss" scoped>
  @import "InterfaceAddress.scss";
</style>
