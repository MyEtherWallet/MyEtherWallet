<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Withdraw"
    right-btn-text="Close"
    :close="close"
    content-size="xlarge"
  >
    <aave-amount-form
      v-if="step === 0"
      :selected-token="preSelectedToken"
      :show-toggle="aaveWithdrawForm.showToggle"
      :left-side-values="aaveWithdrawForm.leftSideValues"
      :right-side-values="aaveWithdrawForm.rightSideValues"
      :form-text="aaveWithdrawForm.formText"
      :button-title="aaveWithdrawForm.buttonTitle"
      :aave-balance="aaveWithdrawForm.depositedBalance"
      :token-decimal="aaveWithdrawForm.decimals"
      @cancel="handleCancel"
      @emitValues="handleWithdrawAmount"
    />

    <!--
        =====================================================================================
          Step 2: Withdraw Summary
        =====================================================================================
        -->
    <aave-summary
      v-if="step === 1"
      :selected-token="preSelectedToken"
      :amount="amount"
      :action-type="withdrawTitle"
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
import BigNumber from 'bignumber.js';
import { ref, computed, watch } from 'vue';
import { toBN, toHex } from 'web3-utils';

import AaveAmountForm from '../AaveAmountForm';
import AaveSummary from '../AaveSummary';
import { AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { MAX_UINT_AMOUNT } from '@aave/contract-helpers';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

// injection/use
const { trackDapp } = useAmplitude();
const { network, getFiatValue } = useGlobalStore();
const { tokensList, balanceInETH, address } = useWalletStore();

// data
const props = defineProps({
  open: {
    default: false,
    type: Boolean
  },
  close: {
    default: () => {},
    type: Function
  },
  preSelectedToken: {
    default: () => {
      return {};
    },
    type: Object
  },
  onWithdraw: {
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
  selectedTokenInUserSummary: {
    type: Object,
    default: () => {}
  },
  currentHealthFactor: {
    type: String,
    default: '-'
  }
});

// data
const withdrawTitle = AAVE_TABLE_TITLE.withdraw;
const step = ref(0);
const amount = ref('0');

// computed
const tokenBalanceUSD = computed(() => {
  const symbol = props.preSelectedToken.token;
  const hasBalance = tokensList.value.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
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

const tokenBalance = computed(() => {
  const symbol = props.preSelectedToken.token;
  if (symbol === network.value.type.currencyName) return balanceInETH.value;
  const hasBalance = tokensList.value.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  return hasBalance
    ? BigNumber(hasBalance.balancef)
        .decimalPlaces(hasBalance.decimals)
        .toFixed()
    : '0';
});

const amountUSD = computed(() => {
  return getFiatValue(
    BigNumber(amount.value).times(tokenPrice.value).toFixed()
  );
});

const aaveWithdrawForm = computed(() => {
  const hasDeposit = props.preSelectedToken;
  const depositedBalance = `${
    formatFloatingPointValue(hasDeposit?.underlyingBalance || 0).value
  } ${props.preSelectedToken.token}`;
  const depositedBalanceInUSD = getFiatValue(
    BigNumber(tokenPrice.value).times(hasDeposit?.underlyingBalance || 0)
  );
  const tokenBalance = `${formatFloatingPointValue(tokenBalance.value).value} ${
    props.preSelectedToken.token
  }`;
  const usd = getFiatValue(tokenBalanceUSD.value);
  return {
    showToggle: true,
    leftSideValues: {
      title: depositedBalance,
      caption: depositedBalanceInUSD,
      subTitle: 'Aave Withdraw Balance'
    },
    rightSideValues: {
      title: tokenBalance,
      caption: usd,
      subTitle: 'Aave Wallet Balance'
    },
    formText: {
      title: 'How much would you like to withdraw?',
      caption:
        'Here you can set the amount you want to withdraw. You can manually enter a specific amount or use the percentage buttons below.'
    },
    buttonTitle: {
      action: 'Withdraw',
      cancel: 'Cancel withdraw'
    },
    depositedBalance: hasDeposit?.underlyingBalance || '0',
    decimals: hasDeposit?.reserve?.decimals || 18
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

const handleWithdrawAmount = e => {
  amount.value = e;
  step.value = 1;
};

const handleConfirm = () => {
  trackDapp('aaveWithdrawEvent');
  amount.value =
    amount.value === tokenBalance.value
      ? toBN(MAX_UINT_AMOUNT)
      : toBase(amount.value, props.preSelectedToken.decimals);
  const param = {
    user: address.value,
    reserve: props.preSelectedToken.underlyingAsset,
    amount: toHex(amount.value)
  };
  props.onWithdraw(param).then(() => {
    trackDapp('aaveWithdrawCollateral');
  });
  step.value = 0;
  props.close();
};

const handleCancel = () => {
  props.close();
};
</script>
