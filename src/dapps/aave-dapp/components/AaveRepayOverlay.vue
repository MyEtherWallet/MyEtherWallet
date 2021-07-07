<template>
  <!--
  =====================================================================================
    Repay Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Repay"
    right-btn-text="Close"
    :close="close"
    class="mew-component--aave-repay-overlay"
  >
    <template #mewOverlayBody>
      <div>
        <aave-amount-form
          :selected-token="preSelectedToken"
          :handler="handler"
          :show-toggle="aaveRepayForm.showToggle"
          :left-side-values="aaveRepayForm.leftSideValues"
          :right-side-values="aaveRepayForm.rightSideValues"
          :form-text="aaveRepayForm.formText"
          :button-title="aaveRepayForm.buttonTitle"
          :token-balance="totalBorrow"
          @cancel="handleCancel"
          @emitValues="handleRepayAmount"
        />
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import { convertToFixed } from '../handlers/helpers';
import AaveAmountForm from './AaveAmountForm';
import aaveOverlayMixin from '../handlers/aaveOverlayMixin';
export default {
  components: {
    AaveAmountForm
  },
  mixins: [aaveOverlayMixin],
  data() {
    return {
      amount: ''
    };
  },
  computed: {
    totalBorrow() {
      const borrows = this.selectedTokenInUserSummary?.currentBorrows;
      return borrows ? borrows : '0';
    },
    aaveRepayForm() {
      const hasBorrowed = this.selectedTokenInUserSummary;
      const borrowedEth = hasBorrowed
        ? `${hasBorrowed.currentBorrows} ${this.preSelectedToken.token}`
        : `$ 0.00`;
      const borrowedUSD = hasBorrowed
        ? `$ ${convertToFixed(hasBorrowed.currentBorrowsUSD)}`
        : `0 ETH`;
      const eth = `${this.handler?.userSummary.totalCollateralETH} ETH`;
      const usd = `$ ${convertToFixed(
        this.handler?.userSummary.totalCollateralUSD
      )}`;
      return {
        showToggle: true,
        leftSideValues: {
          title: borrowedEth,
          caption: borrowedUSD,
          subTitle: 'You borrowed'
        },
        rightSideValues: {
          title: usd,
          caption: eth,
          subTitle: 'Total Collateral'
        },
        formText: {
          title: 'How much would you like to repay?',
          caption:
            'Here you can set the amount you want to repay. You can manually enter a specific amount or use the percentage buttons below.'
        },
        buttonTitle: {
          action: 'Repay',
          cancel: 'Cancel Repay'
        }
      };
    }
  },
  methods: {
    handleRepayAmount(e) {
      const param = {
        aavePool: 'proto',
        amount: e,
        userAddress: this.address,
        reserve: this.actualToken.underlyingAsset
      };
      this.$emit('onConfirm', param);
      this.handleCancel();
    },
    handleCancel() {
      this.amount = '';
      this.close();
    }
  }
};
</script>
