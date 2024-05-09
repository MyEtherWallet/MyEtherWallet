<template>
  <mew-overlay
    :show-overlay="open"
    :close="callClose"
    :title="header"
    content-size="xlarge"
  >
    <!--
      =====================================================================================
        Step 1: Select a token to deposit (Aave token deposit table)
      =====================================================================================
      -->
    <aave-table
      v-if="step === 0"
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
      :user-reserves-data="userSummary.userReservesData"
      :title="depositTitle"
      :user-summary=""
      :is-loading-data=""
      :format-usd-value=""
      :user-borrow-power=""
      :reserves-data=""
      @selectedDeposit="handleSelectedDeposit"
    />
    <!--
        =====================================================================================
          Step 2: Select the amount to deposit
        =====================================================================================
        -->
    <aave-amount-form
      v-if="step === 1"
      :selected-token="selectedToken"
      :show-toggle="aaveDepositForm.showToggle"
      :left-side-values="aaveDepositForm.leftSideValues"
      :right-side-values="aaveDepositForm.rightSideValues"
      :form-text="aaveDepositForm.formText"
      :button-title="aaveDepositForm.buttonTitle"
      :token-balance="tokenBalance"
      :token-decimal="selectedTokenDecimal"
      @cancel="callClose"
      @emitValues="handleDepositAmount"
    />
    <!--
        =====================================================================================
          Step 3: Deposit Summary
        =====================================================================================
        -->
    <aave-summary
      v-if="step === 2"
      :selected-token="selectedToken"
      :amount="amount"
      :step="step"
      :action-type="depositTitle"
      :amount-usd="amountUSD"
      :user-summary=""
      :selectedt-token-in-user-summary=""
      :selected-token-details=""
      @onConfirm="handleConfirm"
    />
  </mew-overlay>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';

import AaveTable from '../AaveTable';
import AaveSummary from '../AaveSummary';
import AaveAmountForm from '../AaveAmountForm.vue';
import { AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import { useWalletStore } from '@/core/store/wallet';
import { useGlobalStore } from '@/core/store/global';
import { useAmplitude } from '@/core/composables/amplitude';

// injections/use
const { tokensList, balanceInETH, address } = useWalletStore();
const { network, getFiatValue } = useGlobalStore();
const { trackDapp } = useAmplitude();

// props
const props = defineProps({
  open: {
    default: false,
    type: Boolean
  },
  close: {
    default: () => {},
    type: Function
  },
  selectedTokenDetails: {
    type: Object,
    default: () => {}
  },
  preSelectedToken: {
    type: Object,
    default: () => {}
  },
  onDeposit: {
    type: Function,
    default: () => {}
  }
});

// data
const depositTitle = ref(AAVE_TABLE_TITLE.deposit);
const step = ref(0);
const selectedToken = ref({});
const amount = ref('0');

// computed
const selectedTokenDecimal = computed(() => {
  return props.selectedTokenDetails ? props.selectedTokenDetails.decimals : 18;
});
const tokenBalanceUSD = computed(() => {
  const symbol = selectedToken.value.token;
  const hasBalance = tokensList.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
});

const tokenPrice = computed(() => {
  return BigNumber(selectedToken.value.price).toFixed();
});

const tokenBalance = computed(() => {
  const symbol = selectedToken.value.token;
  if (symbol === network.type.currencyName) return balanceInETH;
  const hasBalance = tokensList.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  const decimals = BigNumber(10).pow(selectedToken.value.decimals);
  return hasBalance
    ? BigNumber(hasBalance.balance).dividedBy(decimals).toFixed()
    : '0';
});

const amountUSD = computed(() => {
  return getFiatValue(
    BigNumber(amount.value).times(tokenPrice.value).toFixed()
  );
});

const header = computed(() => {
  switch (step.value) {
    case 1:
      return 'Deposit';
    case 2:
      return 'Confirmation';
    default:
      return 'Select the token you want to deposit';
  }
});

const aaveDepositForm = computed(() => {
  const hasDeposit = selectedToken.value;
  const depositedBalance = `${
    formatFloatingPointValue(hasDeposit?.underlyingBalance || 0).value
  } ${selectedToken.value.token}`;
  const depositedBalanceInUSD = getFiatValue(
    BigNumber(tokenPrice.value).times(hasDeposit?.underlyingBalance || 0)
  );

  const tokenBalance = `${formatFloatingPointValue(tokenBalance.value).value} ${
    selectedToken.value.token
  }`;
  const usd = getFiatValue(tokenBalanceUSD.value);
  return {
    showToggle: true,
    leftSideValues: {
      title: depositedBalance,
      caption: depositedBalanceInUSD,
      subTitle: 'Aave Deposit Balance'
    },
    rightSideValues: {
      title: tokenBalance,
      caption: usd,
      subTitle: 'Aave Wallet Balance'
    },
    formText: {
      title: 'How much would you like to deposit?',
      caption:
        'Here you can set the amount you want to deposit. You can manually enter a specific amount or use the percentage buttons below.'
    },
    buttonTitle: {
      action: 'Deposit',
      cancel: 'Cancel deposit'
    }
  };
});

// watch
watch(
  props.preSelectedToken,
  newVal => {
    if (newVal && !isEmpty(newVal)) {
      handleSelectedDeposit(props.preSelectedToken);
    }
    if (isEmpty(newVal)) {
      selectedToken.value = {};
      step.value = 0;
    }
  },
  { deep: true }
);

watch(step, val => {
  if (val === 0) selectedToken.value = {};
});

// methods

const handleSelectedDeposit = val => {
  selectedToken.value = val;
  step.value = 1;
};

const handleDepositAmount = e => {
  step.value = 2;
  amount.value = e;
};

const callClose = () => {
  step.value = 0;
  selectedToken.value = {};
  amount.value = '0';
  depositTitle.value = AAVE_TABLE_TITLE.deposit;
  props.close(false);
};

const handleConfirm = () => {
  const amount = toBase(amount.value, selectedToken.value.decimals);
  const param = {
    user: address,
    amount: amount,
    referralCode: '14',
    reserve: selectedToken.value.underlyingAsset
  };
  props.onDeposit(param).then(() => {
    trackDapp('aaveDepositedCollateral');
  });
  callClose();
};
</script>
