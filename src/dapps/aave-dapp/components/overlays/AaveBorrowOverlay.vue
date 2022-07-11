<template>
  <mew-overlay
    :show-overlay="open"
    :title="header"
    :close="callClose"
    content-size="xlarge"
  >
    <!--
      =====================================================================================
        Aave table borrow table
      =====================================================================================
      -->
    <aave-table
      v-if="step === 0"
      :title="borrowTitle"
      @selectedBorrow="handleSelectedBorrow"
    />
    <!--
      =====================================================================================
        Aave token borrow form
      =====================================================================================
      -->
    <aave-amount-form
      v-if="step === 1"
      :selected-token="selectedToken"
      :action-type="borrowTitle"
      :show-toggle="aaveBorrowForm.showToggle"
      :left-side-values="aaveBorrowForm.leftSideValues"
      :right-side-values="aaveBorrowForm.rightSideValues"
      :form-text="aaveBorrowForm.formText"
      :button-title="aaveBorrowForm.buttonTitle"
      @cancel="handleCancel"
      @emitValues="handleValues"
    />
    <!--
      =====================================================================================
        Aave select interest
      =====================================================================================
      -->
    <aave-select-interest
      v-if="step === 2"
      :selected-token="selectedTokenDetails"
      @continue="handleContinue"
    />
    <!--
      =====================================================================================
        Aave Summary
      =====================================================================================
      -->
    <aave-summary
      v-if="step === 3"
      :selected-token="selectedToken"
      :amount="amount"
      :step="step"
      :apr="apr"
      :action-type="borrowTitle"
      :amount-usd="aaveBorrowForm.amountInUSD"
      @onConfirm="handleConfirm"
    />
  </mew-overlay>
</template>

<script>
import AaveTable from '../AaveTable';
import AaveSummary from '../AaveSummary';
import AaveAmountForm from '../AaveAmountForm.vue';
import AaveSelectInterest from '../AaveSelectInterest.vue';
import { AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { mapGetters, mapState } from 'vuex';
import { isEmpty } from 'lodash';
import handlerAave from '../../handlers/handlerAave.mixin';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

export default {
  components: { AaveTable, AaveAmountForm, AaveSelectInterest, AaveSummary },
  mixins: [handlerAave],
  data() {
    return {
      step: 0,
      selectedToken: {},
      borrowTitle: AAVE_TABLE_TITLE.borrow,
      amount: '0',
      apr: {}
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['getFiatValue']),
    aaveBorrowForm() {
      const hasBorrowed = this.selectedTokenInUserSummary;
      const borrowedEth = hasBorrowed
        ? `${formatFloatingPointValue(hasBorrowed.totalBorrows).value} ${
            this.selectedToken.token
          }`
        : this.getFiatValue(0);
      const borrowedUSD = hasBorrowed
        ? this.getFiatValue(this.formatUSDValue(hasBorrowed.totalBorrowsUSD))
        : `0 ETH`;
      const eth = `${
        formatFloatingPointValue(
          this.userSummary.totalCollateralMarketReferenceCurrency
        ).value
      } ETH`;
      const usd = this.getFiatValue(
        this.formatUSDValue(this.userSummary.totalCollateralUSD)
      );
      const amountUSD = this.getFiatValue(
        this.formatUSDValue(this.amount * hasBorrowed.reserve.priceInUSD)
      );
      return {
        showToggle: false,
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
          title: 'How much would you like to borrow?',
          caption: 'Here you can set the amount you want to borrow.'
        },
        buttonTitle: {
          action: 'Borrow',
          cancel: 'Cancel Borrow'
        },
        amountInUSD: amountUSD
      };
    },
    header() {
      switch (this.step) {
        case 1:
          return 'Borrow';
        case 2:
          return 'Select Interest';
        case 3:
          return 'Confirmation';
        default:
          return 'Select the token you want to borrow';
      }
    },
    amountWithDecimals() {
      return 10 ** this.selectedTokenDetails.decimals * this.amount;
    }
  },
  watch: {
    preSelectedToken(newVal) {
      if (newVal && !isEmpty(newVal)) {
        this.handleSelectedBorrow(this.preSelectedToken);
      }
    }
  },
  methods: {
    handleSelectedBorrow(e) {
      this.selectedToken = e;
      this.step = 1;
    },
    handleValues(e) {
      this.step = 2;
      this.amount = e;
    },
    handleCancel() {
      this.callClose();
    },
    callClose() {
      this.step = 0;
      this.selectedToken = {};
      this.borrowTitle = AAVE_TABLE_TITLE.borrow;
      this.amount = '0';
      this.close();
    },
    handleContinue(apr) {
      this.apr = apr;
      this.step = 3;
    },
    handleConfirm() {
      const data = {
        user: this.address,
        reserve: this.selectedTokenDetails.underlyingAsset,
        amount: this.amountWithDecimals,
        interestRateMode: this.apr.type,
        referralCode: '14'
      };
      this.onBorrow(data);
      this.callClose();
    }
  }
};
</script>

<style lang="scss" scoped></style>
