<template>
  <TheWrapperWallet
    :total-left-col-items="showBanner ? 3 : 2"
    :has-draggable="false"
    :total-right-col-items="2"
  >
    <template #leftColItem1>
      <div>
        <ModuleBalance />
      </div>
    </template>
    <template v-if="showBanner" #leftColItem2>
      <div>
        <DashboardBanner />
      </div>
    </template>
    <template #[hasBanner]>
      <ModuleTokens />
    </template>
    <template v-if="isEthNetwork" #rightColItem1>
      <ModuleSwapRates />
    </template>
    <template #[name]>
      <WalletCarousel />
    </template>
  </TheWrapperWallet>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';

import { global as useGlobalStore } from '@/core/store/index.js';

import { ETH, HOLESKY, GOERLI } from '@/utils/networks/types';

const WalletCarousel = defineAsyncComponent(() =>
  import('@/views/components-wallet/WalletCarousel.vue')
);
const ModuleBalance = defineAsyncComponent(() =>
  import('@/modules/balance/ModuleBalance')
);
const ModuleTokens = defineAsyncComponent(() =>
  import('@/modules/balance/ModuleTokens')
);
const ModuleSwapRates = defineAsyncComponent(() =>
  import('@/modules/swap/ModuleSwapRates')
);
const TheWrapperWallet = defineAsyncComponent(() =>
  import('@/views/components-wallet/TheWrapperWallet')
);
const DashboardBanner = defineAsyncComponent(() =>
  import('@/views/components-wallet/DashboardBanner.vue')
);

// injections/use
const { isEthNetwork, network } = useGlobalStore();
const stakingSupported = [GOERLI, HOLESKY, ETH];
const showBanner = computed(() => {
  const supportedIdx = stakingSupported.findIndex(item => {
    if (item.chainID === network.type.chainID) return item;
  });
  return supportedIdx > -1;
});

const hasBanner = computed(() => {
  return `leftColItem${showBanner.value ? 3 : 2}`;
});

const name = computed(() => {
  return isEthNetwork ? 'rightColItem1' : 'rightColItem2';
});
</script>
