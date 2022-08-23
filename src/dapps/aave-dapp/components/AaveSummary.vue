<template>
  <!--
  =====================================================================================
    Aave Summary (includes currency and health factor)
    used for deposit, borrow, collateral and select interest details
  =====================================================================================
  -->
  <div class="full-width">
    <!--
  =====================================================================================
    Deposit/Borrow currency details card
  =====================================================================================
  -->
    <v-card
      v-if="isDeposit || isBorrow || isWithdraw || isRepay"
      class="d-flex align-center justify-space-between pa-7 mb-6"
      flat
      color="overlayBg"
    >
      <div class="d-flex flex-column align-start">
        <span class="mew-heading-3 textLight--text mb-2"
          >Amount to {{ actionTitle }}</span
        >
        <span class="mew-heading-1 mb-2"
          >{{ formattedAmount }} {{ tokenSymbol }}</span
        >
        <span class="textLight--text">{{ amountUsd }}</span>
      </div>
      <img
        :height="$vuetify.breakpoint.mdAndUp ? '80' : '30'"
        :src="tokenIcon"
        :alt="tokenSymbol"
      />
    </v-card>
    <!--
  =====================================================================================
    Select interest details card
  =====================================================================================
  -->
    <div
      v-if="isInterest"
      class="d-flex align-center justify-space-between mb-10"
    >
      <v-card flat class="d-flex flex-column pa-10 text-left" color="overlayBg">
        <span class="font-weight-bold">Current Interest Type</span>
        <span
          :class="[
            'mew-heading-2 my-3',
            getInterestTypeClass(currentInterest.type)
          ]"
          >{{ currentInterest.percentage }}</span
        >
        <span
          :class="[
            'font-weight-bold',
            getInterestTypeClass(currentInterest.type)
          ]"
          >{{ currentInterest.type }}</span
        >
      </v-card>
      <v-icon>mdi-arrow-right</v-icon>
      <v-card flat class="d-flex flex-column pa-10 text-left" color="overlayBg">
        <span class="font-weight-bold">Next Interest Type</span>
        <span
          :class="[
            'mew-heading-2 my-3',
            getInterestTypeClass(nextInterest.type)
          ]"
          >{{ nextInterest.percentage }}</span
        >
        <span
          :class="['font-weight-bold', getInterestTypeClass(nextInterest.type)]"
          >{{ nextInterest.type }}</span
        >
      </v-card>
    </div>
    <v-divider v-if="isInterest" />
    <!--
  =====================================================================================
    Other details (currency, health factor)
  =====================================================================================
  -->
    <v-row
      v-for="(detail, idx) in details"
      :key="idx"
      class="d-flex align-center"
    >
      <v-col class="d-flex align-center" cols="6"
        ><span>{{ detail.title }}</span>
        <mew-tooltip v-if="detail.tooltip" class="ml-1" :text="detail.tooltip"
      /></v-col>
      <v-col class="font-weight-bold d-flex align-center justify-end" cols="6">
        <img v-if="detail.icon" :src="detail.icon" height="20" class="mr-1" />
        <v-icon v-if="detail.indicator" :class="detail.class" dense>{{
          detail.indicator
        }}</v-icon>
        <span :class="detail.class">{{ detail.value }}</span>
      </v-col>
    </v-row>
    <v-divider v-if="isInterest" class="mt-5" />
    <!--
  =====================================================================================
   Confirm button
  =====================================================================================
  -->
    <mew-button
      class="mt-10 mx-auto d-block"
      :title="btnTitle"
      btn-size="xlarge"
      :disabled="disableBtn"
      @click.native="confirm"
    />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { ACTION_TYPES, INTEREST_TYPES } from '../handlers/helpers';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import handlerAave from '../handlers/handlerAave.mixin';

export default {
  mixins: [handlerAave],
  props: {
    actionType: {
      type: String,
      default: ''
    },
    apr: {
      type: Object,
      default: () => {}
    },
    selectedToken: {
      type: Object,
      default: () => {}
    },
    amount: {
      type: String,
      default: '0'
    },
    amountUsd: {
      type: String,
      default: '0'
    },
    step: {
      type: Number,
      default: 0
    }
  },
  computed: {
    formattedAmount() {
      return formatFloatingPointValue(this.amount || '0').value;
    },
    actionTitle() {
      if (this.isBorrow) {
        return 'Borrow';
      }
      if (this.isRepay) {
        return 'Repay';
      }
      if (this.isWithdraw) {
        return 'Withdraw';
      }
      return 'Deposit';
    },
    isDeposit() {
      return this.actionType.toLowerCase() === ACTION_TYPES.deposit;
    },
    isRepay() {
      return this.actionType.toLowerCase() === ACTION_TYPES.repay;
    },
    isBorrow() {
      return this.actionType.toLowerCase() === ACTION_TYPES.borrow;
    },
    isInterest() {
      return this.actionType.toLowerCase() === ACTION_TYPES.interest;
    },
    isWithdraw() {
      return this.actionType.toLowerCase() === ACTION_TYPES.withdraw;
    },
    isCollateral() {
      return this.actionType.toLowerCase() === ACTION_TYPES.collateral;
    },
    currentHealthFactorTooltip() {
      return 'The health factor is the numeric representation of the safety of your deposited assets against the borrowed assets and its underlying value. The higher the value is, the safer the state of your funds are against a liquidation scenario.';
    },
    nextHealthFactorTooltip() {
      return `This transaction will ${
        +this.currentHealthFactor > +this.nextHealthFactor
          ? 'lower'
          : 'increase'
      } your health factor. If the health factor reaches 1, the liquidation of your deposits will be triggered. A Health Factor below 1 can get liquidated.`;
    },
    details() {
      let details = [
        {
          title: 'Currency',
          value: this.tokenSymbol,
          icon: this.tokenIcon
        }
      ];
      switch (this.actionType.toLowerCase()) {
        /**
         * Case: Aave Deposit, Withdraw and Collateral Summary
         */
        case ACTION_TYPES.deposit:
        case ACTION_TYPES.withdraw:
        case ACTION_TYPES.repay:
        case ACTION_TYPES.collateral:
          details = this.step === 1 && this.isDeposit ? [] : details;
          details.push(
            {
              title: 'Current Health Factor',
              tooltip: this.currentHealthFactorTooltip,
              value: this.currentHealthFactor,
              class: ''
            },
            {
              title: 'Next Health Factor',
              tooltip: this.nextHealthFactorTooltip,
              value: this.nextHealthFactor,
              class:
                +this.currentHealthFactor > +this.nextHealthFactor
                  ? 'redPrimary--text'
                  : 'greenPrimary--text',
              indicator:
                +this.currentHealthFactor == +this.nextHealthFactor
                  ? ''
                  : +this.currentHealthFactor < +this.nextHealthFactor
                  ? 'mdi-arrow-up-bold'
                  : 'mdi-arrow-down-bold'
            }
          );
          return details;
        case ACTION_TYPES.borrow:
          if (this.step === 3) {
            details = [
              {
                title: 'Interest APR',
                value: this.apr.percentage,
                class:
                  this.apr.type.toLowerCase() === INTEREST_TYPES.stable
                    ? 'secondary--text'
                    : 'warning--text text--darken-1'
              },
              {
                title: 'Interest rate type',
                value: this.apr.type,
                class:
                  this.apr.type.toLowerCase() === INTEREST_TYPES.stable
                    ? 'secondary--text capitalize'
                    : 'warning--text text--darken-1 capitalize'
              }
            ];
          } else if (this.step === 4) {
            details.push(
              {
                title: 'Current Health Factor',
                tooltip: this.currentHealthFactorTooltip,
                value: this.currentHealthFactor,
                class: ''
              },
              {
                title: 'Next Health Factor',
                tooltip: this.nextHealthFactorTooltip,
                value: this.nextHealthFactor,
                class:
                  +this.currentHealthFactor >= +this.nextHealthFactor
                    ? 'redPrimary--text'
                    : 'greenPrimary--text',
                indicator:
                  +this.currentHealthFactor == +this.nextHealthFactor
                    ? ''
                    : +this.currentHealthFactor < +this.nextHealthFactor
                    ? 'mdi-arrow-up-bold'
                    : 'mdi-arrow-down-bold'
              }
            );
          }
      }
      return details;
    },
    currentHealthFactor() {
      return new BigNumber(this.userSummary?.healthFactor).toFixed(3);
    },
    nextHealthFactor() {
      const selectedToken = this.selectedTokenInUserSummary;
      let nextHealthFactor = this.currentHealthFactor,
        collateralBalanceETH =
          this.userSummary.totalCollateralMarketReferenceCurrency,
        totalBorrowsETH = this.userSummary.totalBorrowsMarketReferenceCurrency;

      const formattedPriceInETH =
        this.selectedTokenDetails?.formattedPriceInMarketReferenceCurrency;
      const collateralEnabled = selectedToken?.reserve.usageAsCollateralEnabled;
      if (formattedPriceInETH && this.amount !== '0') {
        const ethBalance = BigNumber(this.amount).times(formattedPriceInETH);
        if (
          collateralEnabled &&
          (this.isDeposit ||
            (this.isCollateral &&
              !selectedToken?.usageAsCollateralEnabledOnUser))
        ) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralMarketReferenceCurrency
          ).plus(ethBalance);
        } else if (
          collateralEnabled &&
          ((this.isWithdraw && selectedToken?.usageAsCollateralEnabledOnUser) ||
            (this.isCollateral &&
              selectedToken?.usageAsCollateralEnabledOnUser))
        ) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralMarketReferenceCurrency
          ).minus(ethBalance);
        } else if (this.isRepay) {
          totalBorrowsETH = new BigNumber(
            this.userSummary.totalBorrowsMarketReferenceCurrency
          ).minus(ethBalance);
        } else if (this.isBorrow) {
          totalBorrowsETH = new BigNumber(
            this.userSummary.totalBorrowsMarketReferenceCurrency
          ).plus(ethBalance);
        }
        nextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
          collateralBalanceETH,
          totalBorrowsETH,
          this.userSummary.currentLiquidationThreshold
        ).toFixed(3);
      }
      return nextHealthFactor;
    },
    /* currently using dummy data for values */
    currentInterest() {
      return {
        type: 'Variable',
        percentage: '11.33%'
      };
    },
    nextInterest() {
      return {
        type: 'Stable',
        percentage: '2.837%'
      };
    },
    disableBtn() {
      return this.nextHealthFactor <= 1 && this.nextHealthFactor !== '-1.000';
    },
    btnTitle() {
      return !this.disableBtn ? 'Confirm' : 'Health Factor Too Low';
    },
    tokenSymbol() {
      return this.selectedToken?.token;
    },
    tokenIcon() {
      return this.selectedToken?.tokenImg;
    }
  },
  methods: {
    confirm() {
      if (this.step === 1) {
        this.$emit('confirmed');
      } else {
        this.$emit('onConfirm');
      }
    },
    getInterestTypeClass(type) {
      if (type.toLowerCase() === INTEREST_TYPES.stable) {
        return 'secondary--text';
      }
      return 'orangePrimary';
    }
  }
};
</script>
