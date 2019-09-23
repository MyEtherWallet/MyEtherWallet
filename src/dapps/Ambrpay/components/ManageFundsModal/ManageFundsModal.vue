<template>
  <div class="modal-container">
    <b-modal
      ref="manageFundsModal"
      :title="`${manageFundsText} Funds`"
      class="bootstrap-modal"
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
            <p>{{ availableBalanceUSD }}</p>
          </div>
        </div>
        <hr />
        <div v-if="actionStep" class="action-container">
          <p class="funds-txt">
            How many ETH you want to
            <span class="action-txt"> {{ manageFundsText }}? </span>
          </p>
          <input id="" class="mt-3" type="text" name="" />
        </div>
        <div v-if="!actionStep" class="confirmation-container">
          <i class="check-icon fa fa-check" aria-hidden="true" />
          <p v-if="manageFundsText === 'Add'" class="mr-5 ml-5 mt-3 mb-1">
            Your subscription fund <span class="mew-txt">(1 ETH)</span> should
            be updated within the next miunte.
          </p>
          <p v-if="manageFundsText === 'Withdraw'" class="mr-5 ml-5 mt-2">
            Your withdraw fund <span class="mew-txt"> (0.0031 ETH)</span> should
            be in your wallet within the next miunte.
          </p>
        </div>
        <div class="btn-container">
          <button class="mew-btn mt-4 mb-4">
            {{ actionStep ? manageFundsText : 'OK' }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    manageFundsText: {
      type: String,
      default: ''
    },
    availableBalanceEth: {
      type: Number,
      default: 0
    },
    availableBalanceUSD: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      actionStep: false
    };
  },
  methods: {}
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
