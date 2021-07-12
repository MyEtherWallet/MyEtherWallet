<template>
  <!--
  =====================================================================================
    Aave Summary (includes currency and health factor)
    used for deposit, borrow, collateral and select interest details
  =====================================================================================
  -->
  <v-sheet
    class="mew-component--aave-summary pa-4 pa-md-12"
    rounded
    color="white"
    elevation="1"
    :width="$vuetify.breakpoint.mdAndUp ? '650px' : '100%'"
  >
    <!--
  =====================================================================================
    Deposit/Borrow currency details card
  =====================================================================================
  -->
    <v-card
      v-if="isDeposit || isBorrow"
      class="d-flex align-center justify-space-between pa-7 mb-6"
      flat
      color="overlayBg"
    >
      <div class="d-flex flex-column align-start">
        <span class="mew-heading-3 textPrimaryModule--text mb-2"
          >Amount to {{ actionTitle }}</span
        >
        <span class="mew-heading-1 mb-2"
          >{{ amount }} {{ selectedToken.token }}</span
        >
        <span class="textPrimaryModule--text">{{ amountUsd }}</span>
      </div>
      <img
        :height="$vuetify.breakpoint.mdAndUp ? '80' : '30'"
        :src="selectedToken.tokenImg"
        :alt="selectedToken.token"
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
      title="Confirm"
      btn-size="xlarge"
      @click.native="confirm"
    />
  </v-sheet>
</template>

<script>
import BigNumber from 'bignumber.js';
import { ACTION_TYPES, INTEREST_TYPES } from '../handlers/helpers';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';

export default {
  props: {
    actionType: {
      type: String,
      default: ''
    },
    apr: {
      type: Object,
      default: () => {}
    },
    userSummary: {
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
      default: '$ 0.00'
    },
    step: {
      type: Number,
      default: 0
    }
  },
  computed: {
    actionTitle() {
      if (this.isBorrow) {
        return 'Borrow';
      }
      if (this.isRepay) {
        return 'Repay';
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
    details() {
      let details = [
        {
          title: 'Currency',
          value: this.selectedToken.token,
          icon: this.selectedToken.tokenImg
        }
      ];
      switch (this.actionType.toLowerCase()) {
        /**
         * Case: Aave Deposit and Collateral Summary
         */
        case ACTION_TYPES.deposit:
        case ACTION_TYPES.collateral:
          details = this.step === 1 && this.isDeposit ? [] : details;
          details.push(
            {
              title: 'Current Health Factor',
              tooltip: 'Tooltip text',
              value: this.currentHealthFactor,
              class:
                this.currentHealthFactor > this.nextHealthFactor
                  ? 'primary--text'
                  : 'error-text'
            },
            {
              title: 'Next Health Factor',
              tooltip: 'Tooltip text',
              value: this.nextHealthFactor,
              class:
                this.currentHealthFactor <= this.nextHealthFactor
                  ? 'primary--text'
                  : 'error--text',
              indicator:
                this.currentHealthFactor == this.nextHealthFactor
                  ? ''
                  : this.currentHealthFactor < this.nextHealthFactor
                  ? 'mdi-arrow-up-bold'
                  : 'mdi-arrow-down-bold'
            }
          );
          return details;
        case ACTION_TYPES.borrow:
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
      }
      return details;
    },
    currentHealthFactor() {
      return new BigNumber(this.userSummary?.healthFactor).toFixed(3);
    },
    nextHealthFactor() {
      const selectedToken = this.selectedToken;
      let nextHealthFactor = this.currentHealthFactor,
        collateralBalanceETH = this.userSummary.totalCollateralETH,
        totalBorrowsETH = this.userSummary.totalBorrowsETH;
      if (selectedToken?.price && this.amount !== '0') {
        const ethBalance = BigNumber(this.amount).times(
          selectedToken?.price?.priceInEth
        );
        if (this.isDeposit) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralETH
          ).plus(ethBalance);
        } else if (this.isWithdraw) {
          collateralBalanceETH = new BigNumber(
            this.userSummary.totalCollateralETH
          ).minus(ethBalance);
        } else if (this.isRepay) {
          totalBorrowsETH = new BigNumber(
            this.userSummary.totalBorrowsETH
          ).minus(ethBalance);
        }
        nextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
          collateralBalanceETH,
          totalBorrowsETH,
          this.userSummary.totalFeesETH,
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
    }
  },
  methods: {
    confirm() {
      this.$emit('onConfirm');
    }
  }
};
</script>
