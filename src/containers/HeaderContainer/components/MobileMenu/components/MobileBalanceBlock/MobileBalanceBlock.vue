<template>
  <div class="mobile-address-block">
    <interface-balance-modal ref="balanceModal" :balance="localBalance" />
    <div class="wrap">
      <div class="top-block">
        <div class="block-title">
          {{ $t('common.balance') }}
        </div>
        <button class="show-balance-button" @click="showBalanceModal">
          <img src="~@/assets/images/icons/more.svg" />
        </button>
      </div>
      <div class="bottom-block">
        <p class="the-address">{{ localBalance }} {{ network.type.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import InterfaceBalanceModal from '@/layouts/InterfaceLayout/components/InterfaceBalanceModal';

export default {
  components: {
    'interface-balance-modal': InterfaceBalanceModal
  },
  data() {
    return {
      localBalance: '0',
      currentNetwork: '',
      fetchingBalance: true
    };
  },

  computed: {
    ...mapGetters({
      network: 'network',
      wallet: 'wallet',
      online: 'online',
      web3: 'web3',
      account: 'account',
      gasPrice: 'gasPrice'
    })
  },
  watch: {
    account(val) {
      this.localBalance = this.web3.utils.fromWei(val, 'ether');
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
            this.localBalance = this.web3.utils.fromWei(res, 'ether');
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'MobileBalanceBlock.scss';
</style>
