<template>
  <TheWrapperWallet>
    <template #leftColItem1>
      <ModuleContractDeploy />
    </template>
    <template v-if="isEthNetwork" #rightColItem1>
      <ModuleSwapRates />
    </template>
  </TheWrapperWallet>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

import { global as useGlobalStore } from '@/core/store/index.js';

const TheWrapperWallet = defineAsyncComponent(() =>
  import('@/views/components-wallet/TheWrapperWallet')
);
const ModuleSwapRates = defineAsyncComponent(() =>
  import('@/modules/swap/ModuleSwapRates')
);
const ModuleContractDeploy = defineAsyncComponent(() =>
  import('@/modules/contract/ModuleContractDeploy')
);

const { isEthNetwork } = useGlobalStore();
</script>
