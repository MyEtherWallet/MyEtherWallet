<template>
  <div class="transaction-info-blocks">

    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <div class="modal-container">
      <!-- Modal (MEW Connect) ============================================================================================================================================ -->
      <b-modal ref="balance" hide-footer centered class="bootstrap-modal balance nopadding" title="Balance">
        <div class="content-block">
          <div class="flex-container">
            <h4 class="modal-title">Total Balance</h4>
            <div class="margin-left-auto total-balance-amount">
              <span>7130.000000</span> ETH
            </div>
          </div>
        </div>
        <div class="content-block">
          <h4>Equivalent Values</h4>
          <div class="grid-3">
            <p>BTC: 122.00</p>
            <p>CHF: 5234.24</p>
            <p>REP: 42122.00</p>
            <p>USD: $234212.32</p>
            <p>EUR: €133422.32</p>
            <p>GBP: £634212.32</p>
          </div>
        </div>

      </b-modal>
    </div>
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->
    <!-- .modal-container ************************ -->

    <div v-on:click="balanceModalOpen" class="wrap">
      <div class="info-block balance">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/balance.svg">
        </div>
        <div class="block-content">
          <h2>Balance</h2>
          <h4>7130.000000 ETH</h4>
          <div class="icon-container small-tooltop-1">
            <div v-b-tooltip.hover title="More" class="custom-tooltip">
              <img src="~@/assets/images/icons/more.svg">
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
  methods: {
    balanceModalOpen () {
      this.$refs.balance.show()
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
  @import "TransactionBalance.scss";
</style>
