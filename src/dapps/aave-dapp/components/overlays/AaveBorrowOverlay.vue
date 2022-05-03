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
import { mapState } from 'vuex';
import { isEmpty } from 'lodash';
import handlerAave from '../../handlers/handlerAave.mixin';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

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
    aaveBorrowForm() {
      const hasBorrowed = this.selectedTokenInUserSummary;
      const borrowedEth = hasBorrowed
        ? `${formatFloatingPointValue(hasBorrowed.currentBorrows).value} ${
            this.selectedToken.token
          }`
        : `$ 0.00`;
      const borrowedUSD = hasBorrowed
        ? `$ ${formatFiatValue(hasBorrowed.currentBorrowsUSD).value}`
        : `0 ETH`;
      const eth = `${
        formatFloatingPointValue(this.userSummary.totalCollateralETH).value
      } ETH`;
      const usd = `$ ${
        formatFiatValue(this.userSummary.totalCollateralUSD).value
      }`;
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
        }
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
        amount: this.amount,
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
