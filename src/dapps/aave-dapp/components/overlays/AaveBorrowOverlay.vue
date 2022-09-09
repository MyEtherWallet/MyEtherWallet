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
      :token-balance="tokenBalance.toFixed()"
      :token-decimal="tokenDecimals"
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
      v-if="step === 3 || step === 4"
      :selected-token="selectedToken"
      :amount="amount"
      :step="step"
      :apr="apr"
      :action-type="borrowTitle"
      :amount-usd="amountUsd"
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
import { toBase } from '@/core/helpers/unit';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'AaveBorrowOverlay',
  components: { AaveTable, AaveAmountForm, AaveSelectInterest, AaveSummary },
  mixins: [handlerAave, handlerAnalytics],
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
        : `0 ${this.selectedToken.token}`;
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
      const amountUSD = this.getFiatValue(
        this.formatUSDValue(this.amount * hasBorrowed?.reserve?.priceInUSD || 0)
      );
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
          return 'Confirm Interest Rate';
        case 4:
          return 'Confirm Health Factor';
        default:
          return 'Select the token you want to borrow';
      }
    },
    amountWithDecimals() {
      return toBase(this.amount, this.selectedTokenDetails.decimals);
    },
    amountUsd() {
      const amountUSD = this.getFiatValue(
        this.formatUSDValue(
          this.amount * this.selectedTokenDetails.priceInUSD || 0
        )
      );
      return this.step === 1 ? this.aaveBorrowForm.amountInUSD : amountUSD;
    },
    tokenBalance() {
      return this.userBorrowPower(this.selectedTokenDetails);
    },
    tokenDecimals() {
      return this.selectedTokenDetails.decimals;
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
      this.close(false);
    },
    handleContinue(apr) {
      this.apr = apr;
      this.step = 3;
    },
    handleConfirm() {
      if (this.step === 3) this.step = 4;
      else if (this.step === 4) {
        this.trackDapp('aaveBorrowEvent');
        const data = {
          user: this.address,
          reserve: this.selectedTokenDetails.underlyingAsset,
          amount: this.amountWithDecimals,
          interestRateMode: this.apr.type,
          referralCode: '14'
        };
        this.onBorrow(data).then(() => {
          this.trackDapp('aaveBorrowedAssets');
        });
        this.callClose();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
