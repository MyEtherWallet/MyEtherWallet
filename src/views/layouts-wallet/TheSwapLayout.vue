<template>
  <TheWrapperWallet
    :total-left-col-items="1"
    has-draggable
    :total-right-col-items="totalRightColumns"
  >
    <template #leftColItem1>
      <ModuleSwap
        :is-available="hasSwap"
        :from-token="fromToken"
        :to-token="toToken"
        :amount="amount"
      />
    </template>
    <template #rightColItem1>
      <ModuleTokensValue :draggable="hasHistory" />
    </template>
    <template v-if="hasHistory && hasSwap" #rightColItem2>
      <ModuleTransferHistory draggable :is-swap="true" />
    </template>
  </TheWrapperWallet>
</template>

<script>
// constants being imported by setup
const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';
</script>

<script setup>
import { defineProps, computed, onMounted, defineAsyncComponent } from 'vue';
const TheWrapperWallet = defineAsyncComponent(() =>
  import('@/views/components-wallet/TheWrapperWallet')
);
const ModuleSwap = defineAsyncComponent(() =>
  import('@/modules/swap/ModuleSwap')
);
const ModuleTokensValue = defineAsyncComponent(() =>
  import('@/modules/balance/ModuleTokensValue')
);
const ModuleTransferHistory = defineAsyncComponent(() =>
  import('@/modules/transfer-history/ModuleTransferHistory')
);

import { useAmplitude } from '@/core/composables/amplitude.js';
import { COMMON } from '@/modules/analytics-opt-in/handlers/configs/events.js';

import {
  global as useGlobalStore,
  notifications as useNotificationsStore
} from '@/core/store/index.js';

// injections/use
const { trackSwapAmplitude } = useAmplitude();
const { hasSwap } = useGlobalStore();
const { swapNotifications } = useNotificationsStore();

// props
defineProps({
  fromToken: {
    type: String,
    default: ETH_TOKEN
  },
  toToken: {
    type: String,
    default: DAI_TOKEN
  },
  amount: {
    type: String,
    default: ''
  }
});

// computed
const hasHistory = computed(() => {
  return swapNotifications && swapNotifications.length > 0;
});

const totalRightColumns = computed(() => {
  return hasHistory.value && hasSwap ? 2 : 1;
});

onMounted(() => {
  trackSwapAmplitude(COMMON.PAGE_SHOWN);
});
</script>
