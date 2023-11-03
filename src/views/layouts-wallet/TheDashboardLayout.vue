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
      <app-carousel />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
    AppCarousel: () => import('@/core/components/AppCarousel'),
    ModuleBalance: () => import('@/modules/balance/ModuleBalance'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet')
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork']),
    name() {
      return !this.isEthNetwork ? 'rightColItem1' : 'rightColItem2';
    }
  }
};
</script>
