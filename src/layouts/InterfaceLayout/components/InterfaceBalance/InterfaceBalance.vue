<template>
  <div class="info-block-container">
    <interface-balance-modal ref="balance" :balance="balance" />
    <div class="info-block balance">
      <div class="block-image">
        <img class="icon" src="~@/assets/images/icons/balance.svg" />
      </div>
      <div class="block-content">
        <div class="information-container">
          <h2>{{ $t('common.balance') }}</h2>
          <div class="balance-text-container">
            <div v-show="balance !== undefined" class="balance-text">
              <p>{{ balance }}</p>
              <p>&nbsp;ETH</p>
            </div>
            <i v-show="balance === undefined" class="fa fa-spin fa-spinner" />
          </div>
        </div>
        <div class="icon-container">
          <img
            src="~@/assets/images/icons/more.svg"
            @click="balanceModalOpen"
          />
          <i
            v-show="!fetchingBalance"
            class="fa fa-lg fa-refresh"
            @click="fetchBalance"
          />
          <i v-show="fetchingBalance" class="fa fa-lg fa-spinner fa-spin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InterfaceBalanceModal from '../InterfaceBalanceModal';

export default {
  components: {
    'interface-balance-modal': InterfaceBalanceModal
  },
  props: {
    balance: {
      type: String,
      default: '0'
    },
    getBalance: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      fetchingBalance: false
    };
  },
  watch: {
    balance() {
      this.fetchingBalance = false;
    }
  },
  methods: {
    balanceModalOpen() {
      this.$refs.balance.$refs.balance.show();
    },
    fetchBalance() {
      this.fetchingBalance = true;
      setTimeout(() => {
        this.getBalance();
        this.fetchingBalance = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBalance.scss';
</style>
