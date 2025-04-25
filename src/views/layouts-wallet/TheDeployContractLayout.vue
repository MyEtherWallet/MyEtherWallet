<template>
  <the-wrapper-wallet
    :total-left-col-items="1"
    :total-right-col-items="isEthNetworks ? 2 : 1"
  >
    <template #leftColItem1>
      <module-contract-deploy />
    </template>
    <template #rightColItem1>
      <module-trending-tokens />
    </template>
    <template v-if="isEthNetwork" #rightColItem2>
      <module-swap-rates />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'TheDeployContractLayout',
  components: {
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    ModuleContractDeploy: () =>
      import('@/modules/contract/ModuleContractDeploy'),
    ModuleTrendingTokens: () => import('@/modules/swap/ModuleTrendingTokens')
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork'])
  }
};
</script>
