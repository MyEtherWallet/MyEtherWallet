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
import { computed } from 'vue';

import { useGlobalStore } from '@/core/store/global';
import { ETH, HOLESKY, GOERLI } from '@/utils/networks/types';

import WalletCarousel from '@/views/components-wallet/WalletCarousel.vue';
import ModuleBalance from '@/modules/balance/ModuleBalance';
import ModuleTokens from '@/modules/balance/ModuleTokens';
import ModuleSwapRates from '@/modules/swap/ModuleSwapRates';
import TheWrapperWallet from '@/views/components-wallet/TheWrapperWallet';
import DashboardBanner from '@/views/components-wallet/DashboardBanner.vue';

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
