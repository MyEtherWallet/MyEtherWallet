<template>
  <div class="modal-container">
    <b-modal
      ref="confirmationModal" 
      :title="$t('dappsAave.confirmation-modal')"
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div class="header-container">
          <div class="left-container">
            <p class="title">{{$t('dappsAave.amount-to-deposit')}}</p>
            <p class="amount mt-1">{{amount}} <span class="token-name"> {{tokenName}} </span></p>
            <p class="usd-amount mt-1">${{usdAmount}}</p>
          </div>
          <div class="right-container">
            <img
              class="icon"
              src="~@/assets/images/currency/coins/AllImages/DAI.svg"
            />
          </div>
        </div>
        <div class="body-container">
          <div class="health-container">
            <div class="left-container">
              <p>{{$t('dappsAave.current-health')}}</p>
              <p>{{$t('dappsAave.next-health')}}</p>
            </div>
            <div class="right-container">
              <p>{{healthFactor}}</p>
              <!-- placeholder -->
              <p>22323</p>
            </div>
          </div>
          <hr>
          <div class="tx-container">
            <div class="left-container">
              <p>{{$t('dappsAave.gas-fee')}}</p>
              <p>{{$t('dappsAave.total-pay')}}</p>
            </div>
            <div class="right-container">
              <!-- placeholder -->
              <p>0.02222</p>
              <!-- placeholder -->
              <p>0.2222</p>
            </div>
          </div>
          <hr>
        </div>
      </div>

    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    activeDepositTab: {
      type: Boolean,
      default: false
    },
    amount: {
      type: String,
      default: ''
    },
    usdAmount: {
      type: String,
      default: ''
    },
    healthFactor: {
      type: String,
      default: ''
    },
    tokenName: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmationModal.scss';
</style>
