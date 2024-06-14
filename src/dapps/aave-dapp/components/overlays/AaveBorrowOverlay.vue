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
      :user-summary="userSummary"
      :format-usd-value="formatUsdValue"
      :user-borrow-power="userBorrowPower"
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
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
import { isEmpty } from 'lodash';

import { AAVE_TABLE_TITLE } from '../../handlers/helpers';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { toBase } from '@/core/helpers/unit';
import AaveTable from '../AaveTable';
import AaveSummary from '../AaveSummary';
import AaveAmountForm from '../AaveAmountForm.vue';
import AaveSelectInterest from '../AaveSelectInterest.vue';
import { useAmplitude } from '@/core/composables/amplitude';
import { useWalletStore } from '@/core/store/wallet';
import { useGlobalStore } from '@/core/store/global';

// injection/use
const { trackDapp } = useAmplitude();
const { address } = useWalletStore();
const { getFiatValue } = useGlobalStore();

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
  preSelectedToken: {
    type: Object,
    default: () => {}
  },
  selectedTokenDetails: {
    type: Object,
    default: () => {}
  },
  onBorrow: {
    type: Function,
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
  userBorrowPower: {
    type: Function,
    default: () => {}
  },
  selectedTokenInUserSummary: {
    type: Object,
    default: () => {}
  },
  isLoadingData: {
    type: Boolean,
    default: false
  },
  reservesData: {
    type: Array,
    default: () => []
  },
  currentHealthFactor: {
    type: String,
    default: '-'
  }
});

// data
const step = ref(0);
const selectedToken = ref({});
const borrowTitle = ref(AAVE_TABLE_TITLE.borrow);
const amount = ref('0');
const apr = ref({});

// computed
const aaveBorrowForm = computed(() => {
  const hasBorrowed = selectedToken.value;
  const borrowedEth = hasBorrowed
    ? `${formatFloatingPointValue(hasBorrowed.totalBorrows).value} ${
        selectedToken.value.token
      }`
    : `0 ${selectedToken.value.token}`;
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
  const amountUSD = getFiatValue(
    props.formatUsdValue(amount.value * hasBorrowed?.reserve?.priceInUSD || 0)
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
      cancel: 'Cancel borrow'
    },
    amountInUSD: amountUSD
  };
});

const header = computed(() => {
  switch (step.value) {
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
});

const amountWithDecimals = computed(() => {
  return toBase(amount.value, props.selectedTokenDetails.decimals);
});

const amountUsd = computed(() => {
  const amountUSD = getFiatValue(
    props.formatUsdValue(
      amount.value * props.selectedTokenDetails.priceInUSD || 0
    )
  );
  return step.value === 1 ? aaveBorrowForm.value.amountInUSD : amountUSD;
});

const tokenBalance = computed(() => {
  return props.userBorrowPower(props.selectedTokenDetails);
});

const tokenDecimals = computed(() => {
  return props.selectedTokenDetails.decimals;
});

// watch
watch(
  () => props.preSelectedToken,
  newVal => {
    if (newVal && !isEmpty(newVal)) {
      handleSelectedBorrow(props.preSelectedToken);
    }
    if (isEmpty(newVal)) {
      selectedToken.value = {};
      step.value = 0;
    }
  }
);

watch(
  () => step,
  val => {
    if (val === 0) selectedToken.value = {};
  }
);

// methods
const handleSelectedBorrow = e => {
  selectedToken.value = e;
  step.value = 1;
};

const handleValues = e => {
  step.value = 2;
  amount.value = e;
};

const handleCancel = () => {
  callClose();
};

const callClose = () => {
  step.value = 0;
  selectedToken.value = {};
  borrowTitle.value = AAVE_TABLE_TITLE.borrow;
  amount.value = '0';
  props.close(false);
};

const handleContinue = apr => {
  apr.value = apr;
  step.value = 3;
};

const handleConfirm = () => {
  if (step.value === 3) step.value = 4;
  else if (step.value === 4) {
    trackDapp('aaveBorrowEvent');
    const data = {
      user: address.value,
      reserve: props.selectedTokenDetails.underlyingAsset,
      amount: amountWithDecimals,
      interestRateMode: apr.value.type,
      referralCode: '14'
    };
    props.onBorrow(data).then(() => {
      trackDapp('aaveBorrowedAssets');
    });
    callClose();
  }
};
</script>

<style lang="scss" scoped></style>
