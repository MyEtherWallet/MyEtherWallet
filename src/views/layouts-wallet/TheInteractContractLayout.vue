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

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'InteracContractLayout',
  components: {
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    ModuleContractInteract: () =>
      import('@/modules/contract/ModuleContractInteract')
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork'])
  }
};
</script>
