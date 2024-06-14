<template>
  <!--
  =====================================================================================
    Collateral Overlay
  =====================================================================================
  -->
  <mew-overlay :show-overlay="open" :title="title" :close="resetToggle">
    <aave-summary
      :selected-token="preSelectedToken"
      :action-type="collateral"
      :amount="tokenAmount"
      :user-summary="userSummary"
      :selected-token-in-user-summary="selectedTokenInUserSummary"
      :selected-token-details="selectedTokenDetails"
      :current-health-factor="currentHealthFactor"
      @onConfirm="callSwitchCollateral"
    />
  </mew-overlay>
</template>

<script setup>
import { ref, computed } from 'vue';
import AaveSummary from '../AaveSummary';
import { ACTION_TYPES } from '@/dapps/aave-dapp/handlers/helpers';

import { useAmplitude } from '@/core/composables/amplitude';

// emit
const emit = defineEmits(['onConfirm', 'onClose']);

// injections/use
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
  selectedTokenInUserSummary: {
    type: Object,
    default: () => {}
  },
  userSummary: {
    type: Object,
    default: () => {}
  },
  currentHealthFactor: {
    type: String,
    default: '-'
  }
});

// data
const collateral = ref(ACTION_TYPES.collateral);

// computed
const title = computed(() => {
  return !props.selectedTokenInUserSummary
    ? ''
    : !props.selectedTokenInUserSummary?.usageAsCollateralEnabledOnUser
    ? 'Usage as collateral'
    : 'Disable usage as collateral';
});

const tokenAmount = computed(() => {
  return props.selectedTokenInUserSummary?.underlyingBalance;
});

// methods
const callSwitchCollateral = () => {
  const param = {
    reserve: props.selectedTokenDetails.underlyingAsset,
    useAsCollateral:
      !props.selectedTokenInUserSummary.usageAsCollateralEnabledOnUser,
    symbol: props.selectedTokenDetails.symbol
  };
  emit('onConfirm', param);
  trackDapp('aaveSetCollateral');
  props.close();
};

const resetToggle = () => {
  const param = {
    reserve: props.selectedTokenDetails.symbol,
    useAsCollateral:
      props.selectedTokenInUserSummary.usageAsCollateralEnabledOnUser
  };
  emit('onClose', param);
  props.close();
};
</script>
