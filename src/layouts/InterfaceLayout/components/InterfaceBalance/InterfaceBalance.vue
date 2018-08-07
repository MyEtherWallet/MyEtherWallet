<template>
  <div>
    <interface-balance-modal :balance="parsedBalance"></interface-balance-modal>
    <div v-on:click="balanceModalOpen">
      <div class="info-block balance">
        <div class="block-image">
          <img class="icon" src="~@/assets/images/icons/balance.svg">
        </div>
        <div class="block-content">
          <div class="information-container">
            <h2>{{ $t("common.balance")}}</h2>
            <div class="balance-text-container">
              <div v-show="balance !== undefined" class="balance-text"> <p>{{ parsedBalance }}</p> <p>&nbsp;ETH</p></div>
              <i class="fa fa-spin fa-spinner" v-show="balance === undefined"> </i>
            </div>
          </div>
          <div class="icon-container">
            <img src="~@/assets/images/icons/more.svg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBalanceModal from '../InterfaceBalanceModal'
const unit = require('ethjs-unit')

export default {
  props: ['balance'],
  components: {
    'interface-balance-modal': InterfaceBalanceModal
  },
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
    if (this.balance && this.balance !== undefined) {
      this.parsedBalance = unit.fromWei(this.$store.state.web3.utils.toBN(this.balance), 'ether')
    }
  },
  watch: {
    balance (newVal) {
      this.parsedBalance = unit.fromWei(this.$store.state.web3.utils.toBN(this.balance), 'ether')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "InterfaceBalance.scss";
</style>
