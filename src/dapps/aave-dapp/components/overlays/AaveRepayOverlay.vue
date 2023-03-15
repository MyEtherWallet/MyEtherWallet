<template>
  <!--
  =====================================================================================
    Repay Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Repay"
    :close="handleCancel"
    class="mew-component--aave-repay-overlay"
    content-size="xlarge"
  >
    <aave-amount-form
      v-if="open"
      v-show="step === 0"
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

    <!--
        =====================================================================================
          Step 2: Repay Summary
        =====================================================================================
        -->
    <aave-summary
      v-if="open"
      v-show="step === 1"
      :selected-token="preSelectedToken"
      :amount="amount"
      :action-type="repayTitle"
      :amount-usd="amountUSD"
      @onConfirm="handleConfirm"
    />
  </mew-overlay>
</template>

<script>
import AaveAmountForm from '../AaveAmountForm';
import AaveSummary from '../AaveSummary';
import handlerAave from '../../handlers/handlerAave.mixin';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { mapGetters } from 'vuex';
import { INTEREST_TYPES, AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { toBase } from '@/core/helpers/unit';
import { MAX_UINT_AMOUNT } from '@aave/protocol-js';
import BigNumber from 'bignumber.js';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'AaveRepayOverlay',
  components: {
    AaveAmountForm,
    AaveSummary
  },
  mixins: [handlerAave, handlerAnalytics],
  data() {
    return {
      amount: '',
      step: 0,
      repayTitle: AAVE_TABLE_TITLE.repay
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
      let balance = hasBalance ? hasBalance.balance.toString() : '0';
      const decimals = new BigNumber(10).pow(this.tokenDecimals);
      const totalBorrowed = new BigNumber(this.totalBorrow).multipliedBy(
        decimals
      );
      balance = totalBorrowed.lt(balance)
        ? this.totalBorrow.toString()
        : new BigNumber(balance).div(decimals).toFixed();
      return balance;
    },
    tokenDecimals() {
      return this.selectedTokenInUserSummary?.reserve?.decimals || 0;
    },
    totalBorrow() {
      return this.selectedTokenInUserSummary?.totalBorrows || 0;
    },
    tokenPrice() {
      const symbol = this.preSelectedToken.token;
      const hasBalance = this.tokensList.find(item => {
        if (item.symbol === symbol) {
          return item;
        }
      });
      return hasBalance ? BigNumber(hasBalance.price).toFixed() : '0';
    },
    amountUSD() {
      return this.getFiatValue(
        BigNumber(this.amount).times(this.tokenPrice).toFixed()
      );
    },
    aaveRepayForm() {
      const hasBorrowed = this.selectedTokenInUserSummary;
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
          cancel: 'Cancel repay'
        }
      };
    }
  },
  watch: {
    preSelectedToken() {
      this.handleSelectedToken();
    }
  },
  methods: {
    handleSelectedToken() {
      this.step = 0;
    },
    handleRepayAmount(e) {
      this.amount = e;
      this.step = 1;
    },
    handleConfirm() {
      this.trackDapp('aaveRepayEvent');
      const isVariable = this.selectedTokenInUserSummary.variableBorrows > 0;
      const totalBorrow = isVariable
        ? this.selectedTokenInUserSummary.variableBorrows
        : this.selectedTokenInUserSummary.stableBorrows;
      const amount =
        totalBorrow === this.amount
          ? MAX_UINT_AMOUNT
          : toBase(this.amount, this.selectedTokenDetails.decimals);
      const param = {
        amount: amount,
        user: this.address,
        reserve: this.selectedTokenDetails.underlyingAsset,
        interestRateMode: isVariable
          ? INTEREST_TYPES.variable
          : INTEREST_TYPES.stable
      };
      this.onRepay(param).then(() => {
        this.trackDapp('aaveRepayDebt');
      });
      this.handleCancel();
    },
    handleCancel() {
      this.amount = '';
      this.step = 0;
      this.close();
    }
  }
};
</script>
