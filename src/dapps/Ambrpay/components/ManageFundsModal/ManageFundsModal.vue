<template>
  <div class="modal-container">
    <b-modal
      ref="manageFundsModal"
      :title="`${manageFundsText} Funds`"
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div class="balance-container">
          <span class="funds-txt">Available Balance</span>
          <div>
            <p class="funds-txt">{{ availableBalanceEth }} ETH</p>
            <p class="text-right">${{ availableBalanceUsd }}</p>
          </div>
        </div>
        <hr />
        <div v-if="actionStep" class="action-container">
          <p class="funds-txt">
            How much ETH do you want to
            <span class="action-txt"> {{ manageFundsText }}? </span>
          </p>
          <span class="eth-text">ETH</span>
          <input v-model="ethAmount" class="mt-3" type="number" />
          <p v-show="errMsg" class="err-msg pl-2">{{ errMsg }}</p>
        </div>
        <div v-if="!actionStep" class="confirmation-container">
          <i class="check-icon fa fa-check" aria-hidden="true" />
          <p v-if="manageFundsText === 'Add'" class="mr-5 ml-5 mt-3 mb-1">
            Your subscription fund
            <span class="mew-txt">{{ ethAmount }}</span> should be updated
            within the next miunte.
          </p>
          <p v-if="manageFundsText === 'Withdraw'" class="mr-5 ml-5 mt-2">
            Your withdraw fund
            <span class="mew-txt">{{ ethAmount }}</span> should be in your
            wallet within the next miunte.
          </p>
        </div>
        <div class="btn-container">
          <button
            :class="errMsg || !ethAmount ? 'disabled' : ''"
            class="mew-btn mt-4 mb-4"
            @click="onClick()"
          >
            {{ actionStep ? manageFundsText : 'OK' }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  props: {
    manageFundsText: {
      type: String,
      default: ''
    },
    availableBalanceEth: {
      type: String,
      default: ''
    },
    availableBalanceUsd: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      actionStep: true,
      ethAmount: 0,
      errMsg: ''
    };
  },
  computed: {
    ...mapState(['web3', 'account'])
  },
  watch: {
    manageFundsText(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.ethAmount = 0;
      }
    },
    ethAmount(newVal) {
      const value = new BigNumber(newVal);
      const accountBalance = this.web3.utils.fromWei(
        new BigNumber(this.account.balance).toFixed(),
        'ether'
      );
      const subAccountBalance = new BigNumber(this.availableBalanceEth);

      if (this.manageFundsText === 'Add' && value.gt(accountBalance)) {
        this.errMsg = 'Amount higher than balance';
      } else if (
        this.manageFundsText === 'Withdraw' &&
        value.gt(subAccountBalance)
      ) {
        this.errMsg = 'Amount higher than subscription balance';
      } else {
        this.errMsg = '';
      }
    }
  },
  methods: {
    onClick() {
      if (this.manageFundsText === 'Add' && this.actionStep === true) {
        this.$emit('addFunds', this.ethAmount);
        this.actionStep = false;
      } else if (
        this.manageFundsText === 'Withdraw' &&
        this.actionStep === true
      ) {
        this.$emit('withdrawFunds', this.ethAmount);
        this.actionStep = false;
      } else {
        this.$refs['manageFundsModal'].hide();
        this.actionStep = true;
        this.ethAmount = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ManageFundsModal.scss';
@import '../../AmbrpayGlobal.scss';
</style>

<style lang="scss">
.modal-body {
  padding: 0;
}
</style>
