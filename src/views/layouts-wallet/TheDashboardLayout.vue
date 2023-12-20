<template>
  <the-wrapper-wallet
    :total-left-col-items="2"
    :has-draggable="false"
    :total-right-col-items="2"
  >
    <template #leftColItem1>
      <div>
        <module-balance />
      </div>
    </template>
    <template #leftColItem2>
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
import { mapGetters } from 'vuex';

export default {
  name: 'TheDashboardLayout',
  components: {
    WalletCarousel: () =>
      import('@/views/components-wallet/WalletCarousel.vue'),
    ModuleBalance: () => import('@/modules/balance/ModuleBalance'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    TheWrapperWallet: () => import('@/views/components-wallet/TheWrapperWallet')
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork']),
    name() {
      return !this.isEthNetwork ? 'rightColItem2' : 'rightColItem3';
    }
  }
};
</script>
