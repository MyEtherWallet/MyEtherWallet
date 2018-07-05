<template>
  <div class="transaction-info-blocks">
    <interface-balance-modal :balance="parsedBalance"></interface-balance-modal>
    <div v-on:click="balanceModalOpen" class="wrap">
      <div class="info-block balance">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/balance.svg">
        </div>
        <div class="block-content">
          <h2>{{ $t("reused.balance")}}</h2>
          <h4 v-show="balance.result !== undefined"> {{ parsedBalance }} ETH</h4>
          <i class="fa fa-spin fa-spinner" v-show="balance.result === undefined"> </i>
          <div class="icon-container">
            <img src="~@/assets/images/icons/more.svg">
            <!-- <p class="bottom-button">{{ $t("txBalance.detail")}} <i class="fa fa-chevron-right" aria-hidden="true"></i></p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const unit = require('ethjs-unit')
export default {
  props: ['balance'],
  data () {
    return {
      parsedBalance: 0
    }
  },
  methods: {
    balanceModalOpen () {
      this.$children[0].$refs.balance.show()
    }
  },
  mounted () {
    if (this.balance && this.balance.result !== undefined) {
      this.parsedBalance = unit.fromWei(this.balance.result, 'ether')
    }
  },
  watch: {
    balance (newVal) {
      this.parsedBalance = unit.fromWei(this.balance.result, 'ether')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceBalance.scss";
</style>
