<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Select your interest rate"
    :close="resetToggle"
  >
    <aave-select-interest
      :selected-token="selectedTokenDetails"
      @continue="handleSetInterestRate"
    />
  </mew-overlay>
</template>

<script setup>
import { ref } from 'vue';

import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import { INTEREST_TYPES } from '../../handlers/helpers';
import AaveSelectInterest from '../AaveSelectInterest';
import { useAmplitude } from '@/core/composables/amplitude';

// emit
const emit = defineEmits(['onConfirm', 'onClose']);

// injections/use
const { trackDapp } = useAmplitude();

// props
const props = defineProps({
  selectedTokenInUserSummary: {
    type: Object,
    default: () => {}
  },
  selectedTokenDetails: {
    type: Object,
    default: () => {}
  },
  open: {
    default: false,
    type: Boolean
  },
  close: {
    default: () => {},
    type: Function
  }
});

// data
const rateType = ref('');

// methods
const handleSetInterestRate = e => {
  rateType.value = e.type;
  const type =
    props.selectedTokenInUserSummary.variableBorrows > 0
      ? INTEREST_TYPES.variable
      : INTEREST_TYPES.stable;
  const param = {
    reserve: props.selectedTokenDetails.underlyingAsset,
    rateMode: type === INTEREST_TYPES.variable ? 2 : 1, // rateMode to switch FROM
    symbol: props.selectedTokenDetails.symbol
  };
  if (e.type === type) {
    Toast(`Selected rate is already ${e.type}`, {}, WARNING);
  } else {
    emit('onConfirm', param);
    trackDapp('aaveSetBorrowRate');
    props.close();
  }
};

const resetToggle = () => {
  const type =
    props.selectedTokenInUserSummary.variableBorrows > 0
      ? INTEREST_TYPES.variable
      : INTEREST_TYPES.stable;
  const param = {
    reserve: props.selectedTokenDetails.symbol,
    value: type === INTEREST_TYPES.variable // rateMode to reset to
  };
  emit('onClose', param);
  props.close();
};
</script>
