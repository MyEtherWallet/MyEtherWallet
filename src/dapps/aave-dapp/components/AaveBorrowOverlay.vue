<template>
  <mew-overlay :show-overlay="open" :title="header" :close="callClose">
    <!--
      =====================================================================================
        Aave token borrow table
      =====================================================================================
      -->
    <v-sheet
      v-if="step === 0"
      color="white"
      max-width="650px"
      class="border-radius--10px pa-4"
    >
      <aave-table
        :handler="handler"
        :table-header="aaveTableHandler"
        @selectedBorrow="handleSelectedBorrow"
      />
    </v-sheet>
    <!--
      =====================================================================================
        Aave token borrow form
      =====================================================================================
      -->
    <div v-if="step === 1">
      <aave-amount-form
        :selected-token="selectedToken"
        :handler="handler"
        :action-type="aaveTableHandler"
        :show-toggle="aaveBorrowForm.showToggle"
        :left-side-values="aaveBorrowForm.leftSideValues"
        :right-side-values="aaveBorrowForm.rightSideValues"
        :form-text="aaveBorrowForm.formText"
        :button-title="aaveBorrowForm.buttonTitle"
        @cancelDeposit="handleCancel"
        @emitValues="handleValues"
      />
    </div>
    <!--
      =====================================================================================
        Aave select interest
      =====================================================================================
      -->
    <div v-if="step === 2">
      <aave-select-interest
        :selected-token="actualToken"
        @continue="handleContinue"
      />
    </div>
    <!--
      =====================================================================================
        Aave Summary
      =====================================================================================
      -->
    <div v-if="step === 3">
      <aave-summary
        :selected-token="selectedToken"
        :handler="handler"
        :amount="amount"
        :amount-usd="amountUsd"
        :step="step"
        :action-type="aaveTableHandler"
        @onConfirm="handleConfirm"
      />
    </div>
  </mew-overlay>
</template>

<script>
import AaveTable from './AaveTable';
import AaveSummary from './AaveSummary';
import AaveAmountForm from './AaveAmountForm.vue';
import AaveSelectInterest from './AaveSelectInterest.vue';
import { AAVE_TABLE_HEADER, convertToFixed } from '../handlers/helpers';
import { mapState } from 'vuex';
import { isEmpty } from 'underscore';
import aaveOverlayMixin from '../handlers/aaveOverlayMixin';

export default {
  components: { AaveTable, AaveAmountForm, AaveSelectInterest, AaveSummary },
  mixins: [aaveOverlayMixin],
  data() {
    return {
      step: 0,
      selectedToken: {},
      aaveTableHandler: AAVE_TABLE_HEADER.BORROW,
      amount: '0',
      type: ''
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    aaveBorrowForm() {
      const hasBorrowed = this.selectedTokenInUserSummary;
      const borrowedEth = hasBorrowed
        ? `${hasBorrowed.currentBorrows} ${this.selectedToken.token}`
        : `$ 0.00`;
      const borrowedUSD = hasBorrowed
        ? `$ ${convertToFixed(hasBorrowed.currentBorrowsUSD)}`
        : `0 ETH`;
      const eth = `${this.handler?.userSummary.totalCollateralETH} ETH`;
      const usd = `$ ${convertToFixed(
        this.handler?.userSummary.totalCollateralUSD
      )}`;
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
        case 3:
          return 'Borrow';
        case 2:
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
    handleContinue(e) {
      this.type = e;
      this.step = 3;
    },
    handleConfirm() {
      const param = {
        aavePool: 'proto',
        userAddress: this.address,
        amount: this.amount,
        referralCode: '14',
        reserve: this.actualToken.underlyingAsset,
        interestRateMode: this.type
      };

      this.$emit('onConfirm', param);
      this.callClose();
    }
  }
};
</script>

<style lang="scss" scoped></style>
