<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-deploy />
    </template>
    <template v-if="isEthNetwork" #rightColItem1>
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
      import('@/modules/contract/ModuleContractDeploy')
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork'])
  }
};
</script>
