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
        :height="vuetify.breakpoint.mdAndUp ? '80' : '30'"
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

<script setup>
import { computed } from 'vue';
import BigNumber from 'bignumber.js';
import { calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';

import { ACTION_TYPES, INTEREST_TYPES } from '../handlers/helpers';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

import { useVuetify } from '../composables/vuetify';

// injections
const vuetify = useVuetify();

// emit
const emit = defineEmits(['confirmed', 'onConfirm']);

// props
const props = defineProps({
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
  },
  userSummary: {
    type: Object,
    default: () => {}
  },
  selectedTokenInUserSummary: {
    type: Object,
    default: () => {}
  },
  selectedTokenDetails: {
    type: Object,
    default: () => {}
  },
  currentHealthFactor: {
    type: String,
    default: '-'
  }
});

// computed
const formattedAmount = computed(() => {
  return formatFloatingPointValue(props.amount || '0').value;
});

const actionTitle = computed(() => {
  if (isBorrow.value) {
    return 'Borrow';
  }
  if (isRepay.value) {
    return 'Repay';
  }
  if (isWithdraw.value) {
    return 'Withdraw';
  }
  return 'Deposit';
});

const isDeposit = computed(() => {
  return props.actionType.toLowerCase() === ACTION_TYPES.deposit;
});

const isRepay = computed(() => {
  return props.actionType.toLowerCase() === ACTION_TYPES.repay;
});

const isBorrow = computed(() => {
  return props.actionType.toLowerCase() === ACTION_TYPES.borrow;
});

const isInterest = computed(() => {
  return props.actionType.toLowerCase() === ACTION_TYPES.interest;
});

const isWithdraw = computed(() => {
  return props.actionType.toLowerCase() === ACTION_TYPES.withdraw;
});

const isCollateral = computed(() => {
  return props.actionType.toLowerCase() === ACTION_TYPES.collateral;
});

const currentHealthFactorTooltip = computed(() => {
  return 'The health factor is the numeric representation of the safety of your deposited assets against the borrowed assets and its underlying value. The higher the value is, the safer the state of your funds are against a liquidation scenario.';
});

const nextHealthFactorTooltip = computed(() => {
  return `This transaction will ${
    +props.currentHealthFactor > +nextHealthFactor.value ? 'lower' : 'increase'
  } your health factor. If the health factor reaches 1, the liquidation of your deposits will be triggered. A Health Factor below 1 can get liquidated.`;
});

const details = computed(() => {
  let details = [
    {
      title: 'Currency',
      value: tokenSymbol,
      icon: tokenIcon
    }
  ];
  const realHealthFactor =
    props.currentHealthFactor === '-'
      ? nextHealthFactor.value
      : props.currentHealthFactor;
  switch (props.actionType.toLowerCase()) {
    /**
     * Case: Aave Deposit, Withdraw and Collateral Summary
     */
    case ACTION_TYPES.deposit:
    case ACTION_TYPES.withdraw:
    case ACTION_TYPES.repay:
    case ACTION_TYPES.collateral:
      details = props.step === 1 && isDeposit.value ? [] : details.value;
      details.push(
        {
          title: 'Current Health Factor',
          tooltip: currentHealthFactorTooltip,
          value: props.currentHealthFactor,
          class: ''
        },
        {
          title: 'Next Health Factor',
          tooltip: nextHealthFactorTooltip.value,
          value: nextHealthFactor.value,
          class:
            realHealthFactor.value == nextHealthFactor.value
              ? ''
              : BigNumber(realHealthFactor.value).gt(nextHealthFactor.value)
              ? 'redPrimary--text'
              : 'greenPrimary--text',
          indicator:
            realHealthFactor.value == nextHealthFactor.value
              ? ''
              : BigNumber(realHealthFactor.value).lt(nextHealthFactor.value)
              ? 'mdi-arrow-up-bold'
              : 'mdi-arrow-down-bold'
        }
      );
      return details;
    case ACTION_TYPES.borrow:
      if (props.step === 3) {
        details = [
          {
            title: 'Interest APR',
            value: props.apr.percentage,
            class:
              props.apr.type.toLowerCase() === INTEREST_TYPES.stable
                ? 'secondary--text'
                : 'warning--text text--darken-1'
          },
          {
            title: 'Interest rate type',
            value: props.apr.type,
            class:
              props.apr.type.toLowerCase() === INTEREST_TYPES.stable
                ? 'secondary--text capitalize'
                : 'warning--text text--darken-1 capitalize'
          }
        ];
      } else if (props.step === 4) {
        details.push(
          {
            title: 'Current Health Factor',
            tooltip: currentHealthFactorTooltip.value,
            value: props.currentHealthFactor,
            class: ''
          },
          {
            title: 'Next Health Factor',
            tooltip: nextHealthFactorTooltip.value,
            value: nextHealthFactor.value,
            class:
              realHealthFactor.value == nextHealthFactor.value
                ? ''
                : BigNumber(realHealthFactor.value).gt(nextHealthFactor.value)
                ? 'redPrimary--text'
                : 'greenPrimary--text',
            indicator:
              realHealthFactor.value == nextHealthFactor.value
                ? ''
                : BigNumber(realHealthFactor.value).lt(nextHealthFactor.value)
                ? 'mdi-arrow-up-bold'
                : 'mdi-arrow-down-bold'
          }
        );
      }
  }
  return details;
});

const nextHealthFactor = computed(() => {
  const selectedToken = props.selectedTokenInUserSummary;
  let nextHealthFactor = props.currentHealthFactor,
    collateralBalanceETH =
      props.userSummary.totalCollateralMarketReferenceCurrency,
    totalBorrowsETH = props.userSummary.totalBorrowsMarketReferenceCurrency;

  const formattedPriceInETH =
    props.selectedTokenDetails?.formattedPriceInMarketReferenceCurrency;
  const collateralEnabled = selectedToken?.reserve.usageAsCollateralEnabled;
  if (formattedPriceInETH && props.amount !== '0') {
    const ethBalance = BigNumber(props.amount).times(formattedPriceInETH);
    if (
      collateralEnabled &&
      (isDeposit.value ||
        (isCollateral.value && !selectedToken?.usageAsCollateralEnabledOnUser))
    ) {
      collateralBalanceETH = new BigNumber(
        props.userSummary.totalCollateralMarketReferenceCurrency
      ).plus(ethBalance);
    } else if (
      collateralEnabled &&
      ((isWithdraw.value && selectedToken?.usageAsCollateralEnabledOnUser) ||
        (isCollateral.value && selectedToken?.usageAsCollateralEnabledOnUser))
    ) {
      collateralBalanceETH = new BigNumber(
        props.userSummary.totalCollateralMarketReferenceCurrency
      ).minus(ethBalance);
    } else if (isRepay.value) {
      totalBorrowsETH = new BigNumber(
        props.userSummary.totalBorrowsMarketReferenceCurrency
      ).minus(ethBalance);
    } else if (isBorrow.value) {
      totalBorrowsETH = new BigNumber(
        props.userSummary.totalBorrowsMarketReferenceCurrency
      ).plus(ethBalance);
    }
    nextHealthFactor = calculateHealthFactorFromBalancesBigUnits(
      collateralBalanceETH,
      totalBorrowsETH,
      props.userSummary.currentLiquidationThreshold
    ).toFixed(3);
  }
  if (nextHealthFactor === 'NaN' || nextHealthFactor === '-1.000')
    nextHealthFactor = '-';
  return nextHealthFactor;
});

const currentInterest = computed(() => {
  return {
    type: 'Variable',
    percentage: '11.33%'
  };
});

const nextInterest = computed(() => {
  return {
    type: 'Stable',
    percentage: '2.837%'
  };
});

const disableBtn = computed(() => {
  return nextHealthFactor.value <= 1 && nextHealthFactor.value !== '-1.000';
});

const btnTitle = computed(() => {
  return !disableBtn.value ? 'Confirm' : 'Health Factor Too Low';
});

const tokenSymbol = computed(() => {
  return props.selectedToken?.token;
});

const tokenIcon = computed(() => {
  return props.selectedToken?.tokenImg;
});

// methods
const confirm = () => {
  if (props.props.step === 1) {
    emit('confirmed');
  } else {
    emit('onConfirm');
  }
};

const getInterestTypeClass = type => {
  if (type.toLowerCase() === INTEREST_TYPES.stable) {
    return 'secondary--text';
  }
  return 'orangePrimary';
};
</script>
