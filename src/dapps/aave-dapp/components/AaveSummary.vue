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
      v-if="isDeposit && step === 3"
      class="d-flex align-center justify-space-between pa-7 mb-6"
      flat
      color="overlayBg"
    >
      <div class="d-flex flex-column align-start">
        <span class="mew-heading-3 textPrimaryModule--text mb-2"
          >Amount to Deposit</span
        >
        <!-- dummy data -->
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
import {
  convertToFixed,
  ACTION_TYPES,
  INTEREST_TYPES
} from '../handlers/helpers';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';

export default {
  props: {
    actionType: {
      type: String,
      default: ''
    },
    handler: {
      type: [Object, null],
      validator: item => typeof item === 'object' || null,
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
    isDeposit() {
      return this.actionType.toLowerCase() === ACTION_TYPES.deposit;
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
                this.currentHealthFactor > this.nextHealthFactor
                  ? 'error--text'
                  : 'primary--text',
              indicator:
                this.currentHealthFactor > this.nextHealthFactor
                  ? 'mdi-arrow-down-bold'
                  : 'mdi-arrow-up-bold'
            }
          );
          return details;
      }
      return details;
    },
    currentHealthFactor() {
      return new BigNumber(this.handler?.userSummary?.healthFactor).toFixed(3);
    },
    nextHealthFactor() {
      const selectedToken = this.actualToken;
      let nextHealthFactor = convertToFixed(this.currentHealthFactor),
        collateralBalanceETH = this.handler?.userSummary.totalCollateralETH;
      const totalBorrowsETH = this.handler?.userSummary.totalBorrowsETH;
      if (selectedToken?.price && this.amount !== '0') {
        const ethBalance = BigNumber(this.amount).times(
          selectedToken?.price?.priceInEth
        );
        collateralBalanceETH = new BigNumber(
          this.handler.userSummary.totalCollateralETH
        ).plus(ethBalance);
        nextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
          collateralBalanceETH,
          totalBorrowsETH,
          this.handler.userSummary.totalFeesETH,
          this.handler.userSummary.currentLiquidationThreshold
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
      return 'warning--text text--darken-1';
    }
  }
};
</script>
