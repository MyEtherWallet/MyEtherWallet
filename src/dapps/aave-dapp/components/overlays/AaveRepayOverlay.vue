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
      :token-balance="tokenBalance"
      :token-decimal="tokenDecimals"
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
import { INTEREST_TYPES } from '../../handlers/helpers';
import { toBase } from '@/core/helpers/unit';
import { MAX_UINT_AMOUNT } from '@aave/protocol-js';

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
    ...mapGetters('wallet', ['tokensList']),
    tokenBalance() {
      const symbol = this.preSelectedToken.token;
      if (symbol === this.network.type.currencyName) return this.balanceInETH;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      let balance = hasBalance ? hasBalance.balancef : '0';
      balance = balance > this.totalBorrow ? this.totalBorrow : balance;
      return balance;
    },
    tokenDecimals() {
      return this.selectedTokenInUserSummary?.reserve?.decimals || 0;
    },
    totalBorrow() {
      return this.selectedTokenInUserSummary?.totalBorrows || 0;
    },
    aaveRepayForm() {
      const hasBorrowed = this.selectedTokenInUserSummary;
      console.log('hasBorrowed', hasBorrowed);
      const borrowedEth = hasBorrowed
        ? `${formatFloatingPointValue(hasBorrowed.totalBorrows).value} ${
            hasBorrowed.reserve?.symbol
          }`
        : `0 ETH`;
      const borrowedUSD = hasBorrowed
        ? this.getFiatValue(this.formatUSDValue(hasBorrowed.totalBorrowsUSD))
        : this.getFiatValue(0);
      const eth = `${
        formatFloatingPointValue(
          this.userSummary.totalCollateralMarketReferenceCurrency
        ).value
      } ETH`;
      const usd = this.getFiatValue(
        this.formatUSDValue(this.userSummary.totalCollateralUSD)
      );
      return {
        showToggle: true,
        leftSideValues: {
          title: borrowedUSD,
          caption: borrowedEth,
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
      // function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf)
      // Repays onBehalfOf's debt amount of asset which has a rateMode
      const isVariable = this.selectedTokenInUserSummary.variableBorrows > 0;
      const totalBorrow = isVariable
        ? this.selectedTokenInUserSummary.variableBorrows
        : this.selectedTokenInUserSummary.stableBorrows;
      const amount =
        totalBorrow === e
          ? MAX_UINT_AMOUNT
          : toBase(e, this.selectedTokenDetails.decimals);
      const param = {
        amount: amount,
        user: this.address,
        reserve: this.selectedTokenDetails.underlyingAsset,
        interestRateMode: isVariable
          ? INTEREST_TYPES.variable
          : INTEREST_TYPES.stable
      };
      console.log('param', param);
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
