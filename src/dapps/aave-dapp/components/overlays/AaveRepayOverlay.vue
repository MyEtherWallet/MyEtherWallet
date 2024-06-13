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
      :user-summary="userSummary"
      :selected-token-in-user-summary="selectedTokenInUserSummary"
      :selected-token-details="selectedTokenDetails"
      :current-health-factor="currentHealthFactor"
      @onConfirm="handleConfirm"
    />
  </mew-overlay>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { MAX_UINT_AMOUNT } from '@aave/protocol-js';
import BigNumber from 'bignumber.js';

import AaveAmountForm from '../AaveAmountForm';
import AaveSummary from '../AaveSummary';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { INTEREST_TYPES, AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { toBase } from '@/core/helpers/unit';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

// injection/use
const { trackDapp } = useAmplitude();
const { getFiatValue, network } = useGlobalStore();
const { tokensList, balanceInETH } = useWalletStore();

// props
const props = defineProps({
  open: {
    default: false,
    type: Boolean
  },
  preSelectedToken: {
    type: Object,
    default: () => {}
  },
  onRepay: {
    type: Function,
    default: () => {}
  },
  close: {
    default: () => {},
    type: Function
  },
  selectedTokenInUserSummary: {
    type: Object,
    default: () => {}
  },
  formatUsdValue: {
    type: Function,
    default: () => {}
  },
  userSummary: {
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

// data
const repayTitle = AAVE_TABLE_TITLE.repay;
const amount = ref('');
const step = ref(0);

// computed
const tokenBalance = computed(() => {
  const symbol = props.preSelectedToken.token;
  if (symbol === network.value.type.currencyName) return balanceInETH.value;
  const hasBalance = tokensList.value.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  let balance = hasBalance ? hasBalance.balance.toString() : '0';
  const decimals = new BigNumber(10).pow(tokenDecimals);
  const totalBorrowed = new BigNumber(totalBorrow).multipliedBy(decimals);
  balance = totalBorrowed.lt(balance)
    ? totalBorrow.value.toString()
    : new BigNumber(balance).div(decimals).toFixed();
  return balance;
});

const tokenDecimals = computed(() => {
  return props.selectedTokenInUserSummary?.reserve?.decimals || 0;
});

const totalBorrow = computed(() => {
  return props.selectedTokenInUserSummary?.totalBorrows || 0;
});

const tokenPrice = computed(() => {
  const symbol = props.preSelectedToken.token;
  const hasBalance = tokensList.value.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  return hasBalance ? BigNumber(hasBalance.price).toFixed() : '0';
});

const amountUSD = computed(() => {
  return getFiatValue(
    BigNumber(amount.value).times(tokenPrice.value).toFixed()
  );
});

const aaveRepayForm = computed(() => {
  const hasBorrowed = props.selectedTokenInUserSummary;
  const borrowedEth = hasBorrowed
    ? `${formatFloatingPointValue(hasBorrowed.totalBorrows).value} ${
        hasBorrowed.reserve?.symbol
      }`
    : `0 ETH`;
  const borrowedUSD = hasBorrowed
    ? getFiatValue(props.formatUsdValue(hasBorrowed.totalBorrowsUSD))
    : getFiatValue(0);
  const eth = `${
    formatFloatingPointValue(
      props.userSummary.totalCollateralMarketReferenceCurrency
    ).value
  } ETH`;
  const usd = getFiatValue(
    props.formatUsdValue(props.userSummary.totalCollateralUSD)
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
});

// watch
watch(
  () => props.preSelectedToken,
  () => {
    handleSelectedToken();
  }
);

// methods
const handleSelectedToken = () => {
  step.value = 0;
};

const handleRepayAmount = e => {
  amount.value = e;
  step.value = 1;
};

const handleConfirm = () => {
  trackDapp('aaveRepayEvent');
  const isVariable = props.selectedTokenInUserSummary.variableBorrows > 0;
  const totalBorrow = isVariable
    ? props.selectedTokenInUserSummary.variableBorrows
    : props.selectedTokenInUserSummary.stableBorrows;
  const amount =
    totalBorrow === amount.value
      ? MAX_UINT_AMOUNT
      : toBase(amount.value, props.preSelectedToken.decimals);
  const param = {
    amount: amount,
    user: props.userSummary.user,
    reserve: props.preSelectedToken.underlyingAsset,
    interestRateMode: isVariable
      ? INTEREST_TYPES.variable
      : INTEREST_TYPES.stable
  };
  props.onRepay(param).then(() => {
    trackDapp('aaveRepayDebt');
  });
  handleCancel();
};

const handleCancel = () => {
  step.value = 0;
  amount.value = '';
  props.close();
};
</script>
