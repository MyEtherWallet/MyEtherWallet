<template>
  <app-simple-dialog
    :value="gasPriceModal"
    width="420"
    title="Select transaction fee"
    @close="handleClose"
  >
    <settings-gas-price
      :is-swap="true"
      :buttons="gasButtons"
      :set-selected="setGas"
      :gas-price="gasPrice"
      :cost-in-eth="costInEth"
      :tx-fee-formatted="txFeeFormatted"
      :tx-fee-usd="txFeeUsd"
      :not-enough-eth="notEnoughEth"
      :total-gas-limit="totalGasLimit"
      :close-dialog="closeDialog"
      :from-settings="false"
    />
  </app-simple-dialog>
</template>

<script setup>
import { defineAsyncComponent, defineProps, defineEmits, watch } from 'vue';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

import { useGasPrice } from '@/core/composables/gasPrice';

const AppSimpleDialog = defineAsyncComponent(() => import('./AppSimpleDialog'));
const SettingsGasPrice = defineAsyncComponent(() =>
  import('@/modules/settings/components/SettingsGasPrice')
);

// emit
const emit = defineEmits(['onLocalGasPrice', 'close']);

// props
const props = defineProps({
  gasPriceModal: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: () => {}
  },
  notEnoughEth: {
    type: Boolean,
    default: false
  },
  costInEth: {
    type: String,
    default: '0'
  },
  txFeeFormatted: {
    type: String,
    default: '0'
  },
  txFeeUsd: {
    type: String,
    default: '0'
  },
  totalGasLimit: {
    type: String,
    default: '0'
  }
});

// injections/use
const { gasButtons, setSelected } = useGasPrice();
const { gasPrice, gasPriceByType, gasPriceType } = useGlobalStore();
// watchers
/**
     * emit gas when modal
     * opens in case of difference
      OR
     * only emit new gas price
     * when modal is open
     */
watch([props.gasPriceModal, gasPrice], ([newGasPriceModal]) => {
  if (newGasPriceModal || props.gasPriceModal) {
    emit('onLocalGasPrice', gasPriceByType(gasPriceType));
  }
});

const setGas = value => {
  emit('onLocalGasPrice', gasPriceByType(value));
  setSelected(value);
  closeDialog();
};
const closeDialog = () => {
  props.close();
};
const handleClose = () => {
  emit('close');
};
</script>

<style></style>
