<template>
  <div class="modal-container">
    <b-modal
      ref="manageFundsModal"
      :title="`${manageFundsText} Funds`"
      class="bootstrap-modal"
      centered
      hide-footer
      static="true"
      lazy="true"
    >
      <div class="modal-contents">
        <div class="balance-container">
          <span class="balance-txt">Available Balance</span>
          <div>
            <span>{{ availableBalanceEth }}</span>
            <span>{{ availableBalanceUSD }}</span>
          </div>
        </div>
        <hr />
        <div class="btn-container">
          <button class="large-round-button-green-filled">
            {{ manageFundsText }}
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
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'ManageFundsModal.scss';
</style>
