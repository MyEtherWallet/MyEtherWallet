<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-interact />
    </template>
    <template v-if="isEthNetwork" #rightColItem1>
      <module-swap-rates />
    </template>
  </the-wrapper-wallet>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

const TheWrapperWallet = defineAsyncComponent(() =>
  import('@/views/components-wallet/TheWrapperWallet')
);
const ModuleSwapRates = defineAsyncComponent(() =>
  import('@/modules/swap/ModuleSwapRates')
);
const ModuleContractInteract = defineAsyncComponent(() =>
  import('@/modules/contract/ModuleContractInteract')
);

const { isEthNetwork } = useGlobalStore();
</script>
