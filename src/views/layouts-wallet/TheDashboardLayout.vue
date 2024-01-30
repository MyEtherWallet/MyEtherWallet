<template>
  <the-wrapper-wallet
    :total-left-col-items="showBanner ? 3 : 2"
    :has-draggable="false"
    :total-right-col-items="2"
  >
    <template #leftColItem1>
      <div>
        <module-balance />
      </div>
    </template>
    <template v-if="showBanner" #leftColItem2>
      <div>
        <dashboard-banner />
      </div>
    </template>
    <template #[hasBanner]>
      <module-tokens />
    </template>
    <template v-if="isEthNetwork" #rightColItem1>
      <module-swap-rates />
    </template>
    <template #[name]>
      <wallet-carousel />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { ETH, GOERLI } from '@/utils/networks/types';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    WalletCarousel: () =>
      import('@/views/components-wallet/WalletCarousel.vue'),
    ModuleBalance: () => import('@/modules/balance/ModuleBalance'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    DashboardBanner: () =>
      import('@/views/components-wallet/DashboardBanner.vue')
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork', 'network']),
    ...mapState('popups', ['showDashboardBanner']),
    stakingSupported() {
      return [GOERLI, ETH];
    },
    showBanner() {
      const supportedIdx = this.stakingSupported.findIndex(item => {
        if (item.chainID === this.network.type.chainID) return item;
      });
      return supportedIdx > -1 && this.showDashboardBanner;
    },
    hasBanner() {
      return `leftColItem${this.showBanner ? 3 : 2}`;
    },
    name() {
      return !this.isEthNetwork ? 'rightColItem1' : 'rightColItem2';
    }
  }
};
</script>
