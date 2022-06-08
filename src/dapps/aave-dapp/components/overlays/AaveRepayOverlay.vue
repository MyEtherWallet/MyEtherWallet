<template>
  <!--
  =====================================================================================
    Repay Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Repay"
    :close="close"
    class="mew-component--aave-repay-overlay"
  >
    <aave-amount-form
      :selected-token="preSelectedToken"
      :show-toggle="aaveRepayForm.showToggle"
      :left-side-values="aaveRepayForm.leftSideValues"
      :right-side-values="aaveRepayForm.rightSideValues"
      :form-text="aaveRepayForm.formText"
      :button-title="aaveRepayForm.buttonTitle"
      :token-balance="totalBorrow"
      @cancel="handleCancel"
      @emitValues="handleRepayAmount"
    />
  </mew-overlay>
</template>

<script>
import AaveAmountForm from '../AaveAmountForm';
import handlerAave from '../../handlers/handlerAave.mixin';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { mapGetters } from 'vuex';

export default {
  components: {
    AaveAmountForm
  },
  mixins: [handlerAave],
  data() {
    return {
      amount: ''
    };
  },
  computed: {
    ...mapGetters('global', ['getFiatValue']),
    totalBorrow() {
      return this.selectedTokenInUserSummary?.currentBorrows || '0';
    },
    aaveRepayForm() {
      const hasBorrowed = this.selectedTokenInUserSummary;
      const borrowedEth = hasBorrowed
        ? `${formatFloatingPointValue(hasBorrowed.currentBorrows).value} ${
            this.preSelectedToken.token
          }`
        : this.getFiatValue(0);
      const borrowedUSD = hasBorrowed
        ? this.getFiatValue(hasBorrowed.currentBorrowsUSD)
        : `0 ETH`;
      const eth = `${
        formatFloatingPointValue(this.userSummary.totalCollateralETH).value
      } ETH`;
      const usd = this.getFiatValue(this.userSummary.totalCollateralUSD);
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
        reserve: this.selectedTokenDetails.underlyingAsset
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
