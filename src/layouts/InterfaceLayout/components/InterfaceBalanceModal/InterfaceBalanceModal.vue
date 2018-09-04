<template>
  <div class="modal-container">
    <b-modal
      ref="balance"
      hide-footer
      class="bootstrap-modal balance nopadding"
      title="Balance">
      <div class="content-block">
        <div class="flex-container">
          <h4 class="modal-title">{{ $t('common.totalBalance') }}</h4>
          <div class="margin-left-auto total-balance-amount">
            <span>{{ balance }}</span> ETH
          </div>
        </div>
      </div>
      <div class="content-block">
        <h4>Equivalent Values</h4>
        <div class="grid-3">
          <p>BTC: 122.00</p>
          <p>CHF: 5234.24</p>
          <p>REP: 42122.00</p>
          <p>USD: $234212.32</p>
          <p>EUR: €133422.32</p>
          <p>GBP: £634212.32</p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    balance: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'InterfaceBalanceModal.scss';
</style>
