<template>
  <div class="mobile-address-block">
    <interface-balance-modal ref="balanceModal" :balance="accountBalance" />
    <div class="wrap">
      <div class="top-block">
        <div class="block-title">{{ $t('common.balance') }}</div>
        <button class="show-balance-button" @click="showBalanceModal">
          <img src="~@/assets/images/icons/more.svg" />
        </button>
      </div>
      <div class="bottom-block">
        <p class="the-address">{{ accountBalance }} {{ network.type.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Toast } from '@/helpers';
import BigNumber from 'bignumber.js';
import InterfaceBalanceModal from '@/layouts/InterfaceLayout/components/InterfaceBalanceModal';

export default {
  components: {
    'interface-balance-modal': InterfaceBalanceModal
  },
  computed: {
    ...mapGetters({
      network: 'network',
      web3: 'web3',
      account: 'account'
    }),
    accountBalance() {
      return this.web3.utils.fromWei(
        new BigNumber(this.account.balance).toFixed(),
        'ether'
      );
    }
  },
  methods: {
    showBalanceModal() {
      this.getBalance();
      this.$refs.balanceModal.$refs.balance.show();
    },
    getBalance() {
      if (this.account.address) {
        this.web3.eth
          .getBalance(this.account.address.toLowerCase())
          .then(res => {
            this.$store.dispatch('setAccountBalance', res);
          })
          .catch(err => {
            Toast.responseHandler(err, Toast.ERROR);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileBalanceBlock.scss';
</style>
