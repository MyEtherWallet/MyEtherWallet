<template>
  <mew-overlay
    :show-overlay="open"
    :title="header"
    :close="callClose"
    content-size="xlarge"
  >
    <!--
      =====================================================================================
        Aave token borrow table
      =====================================================================================
      -->
    <aave-table
      v-if="step === 0"
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
      :user-reserves-data="userSummary.reservesData"
      :table-header="aaveTableHandler"
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
      :action-type="aaveTableHandler"
      :show-toggle="aaveBorrowForm.showToggle"
      :left-side-values="aaveBorrowForm.leftSideValues"
      :right-side-values="aaveBorrowForm.rightSideValues"
      :form-text="aaveBorrowForm.formText"
      :button-title="aaveBorrowForm.buttonTitle"
      @cancelDeposit="handleCancel"
      @emitValues="handleValues"
    />
    <!--
      =====================================================================================
        Aave select interest
      =====================================================================================
      -->
    <aave-select-interest
      v-if="step === 2"
      :selected-token="actualToken"
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
      :amount-usd="amountUsd"
      :step="step"
      :action-type="aaveTableHandler"
      @onConfirm="handleConfirm"
    />
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import AaveSelectInterest from './AaveSelectInterest.vue';
import { AAVE_TABLE_HEADER } from '../handlers/helpers';
import { mapState } from 'vuex';
import { isEmpty } from 'lodash';
import handlerAaveOverlay from '../handlers/handlerAaveOverlay.mixin';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';

export default {
  components: { AaveTable, AaveAmountForm, AaveSelectInterest, AaveSummary },
  mixins: [handlerAaveOverlay],
  data() {
    return {
      step: 0,
      selectedToken: {},
      aaveTableHandler: AAVE_TABLE_HEADER.BORROW,
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
      this.aaveTableHandler = AAVE_TABLE_HEADER.BORROW;
      this.amount = '0';
      this.close();
    },
    handleContinue(apr) {
      this.apr = apr;
      this.step = 3;
    },
    handleConfirm() {
      const param = {
        aavePool: 'proto',
        userAddress: this.address,
        amount: this.amount,
        referralCode: '14',
        reserve: this.actualToken.underlyingAsset,
        interestRateMode: this.apr.type
      };

      this.$emit('onConfirm', param);
      this.callClose();
    }
  }
};
</script>

<style lang="scss" scoped></style>
