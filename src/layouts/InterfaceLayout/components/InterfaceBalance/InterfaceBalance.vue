<template>
  <div>
    <interface-balance-modal :balance="balance"/>
    <div @click="balanceModalOpen">
      <div class="info-block balance">
        <div class="block-image">
          <img
            class="icon"
            src="~@/assets/images/icons/balance.svg">
        </div>
        <div class="block-content">
          <div class="information-container">
            <h2>{{ $t("common.balance") }}</h2>
            <div class="balance-text-container">
              <div
                v-show="balance !== undefined"
                class="balance-text"> <p>{{ balance }}</p> <p>&nbsp;ETH</p></div>
              <i
                v-show="balance === undefined"
                class="fa fa-spin fa-spinner"/>
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
import InterfaceBalanceModal from '../InterfaceBalanceModal';
// const unit = require('ethjs-unit');

export default {
  components: {
    'interface-balance-modal': InterfaceBalanceModal
  },
  props: {
    balance: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      // balance: '0'
    };
  },
  // TODO REMOVE
  // watch: {
  //   balance() {
  //     this.parsedBalance = unit.fromWei(
  //       this.$store.state.web3.utils.toBN(this.balance),
  //       'ether'
  //     );
  //   }
  // },
  // mounted() {
  //   if (this.balance && this.balance !== undefined) {
  //     this.parsedBalance = unit.fromWei(
  //       this.$store.state.web3.utils.toBN(this.balance),
  //       'ether'
  //     );
  //   }
  // },
  methods: {
    balanceModalOpen() {
      this.$children[0].$refs.balance.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBalance-desktop.scss';
@import 'InterfaceBalance-tablet.scss';
@import 'InterfaceBalance-mobile.scss';
</style>
