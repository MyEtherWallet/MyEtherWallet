<template>
  <div class="info-block-container">
    <interface-balance-modal ref="balance" :balance="balance" />
    <div class="info-block balance">
      <div class="block-image">
        <div class="icon-border">
          <img class="icon" src="~@/assets/images/icons/wallet.svg" />
        </div>
      </div>
      <div class="block-content">
        <div class="information-container">
          <h2>{{ $t('common.balance') }}</h2>
          <div class="balance-text-container">
            <div v-show="balance !== undefined" class="balance-text">
              <p>
                {{ balance }} <span>{{ network.type.name }}</span>
              </p>
            </div>
            <i v-show="balance === undefined" class="fa fa-spin fa-spinner" />
          </div>
        </div>
        <div class="icon-container">
          <b-btn
            id="balanceCheck"
            class="custom-tooltip"
            @click="balanceModalOpen"
          >
            <img src="~@/assets/images/icons/more.svg" />
          </b-btn>
          <b-btn
            id="refreshBalance"
            class="custom-tooltip"
            @click="fetchBalance"
          >
            <img
              v-show="!fetchingBalance"
              src="~@/assets/images/icons/change.svg"
            />
            <i v-show="fetchingBalance" class="fa fa-lg fa-spinner fa-spin" />
          </b-btn>
          <b-popover
            content="Check Balance"
            target="balanceCheck"
            placement="top"
            triggers="hover"
            title
          />
          <b-popover
            content="Refresh Balance"
            target="refreshBalance"
            placement="top"
            triggers="hover"
            title
          />
        </div>
        <!-- .icon-container -->
      </div>
      <!-- .block-content -->
    </div>
  </div>
</template>

<script>
import InterfaceBalanceModal from '../InterfaceBalanceModal';
import { mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters({
      network: 'network'
    })
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
