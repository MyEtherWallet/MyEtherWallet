<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-deploy />
    </template>
    <template #rightColItem1>
      <module-swap-rates />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import ModuleSwapRates from '@/modules/swap/ModuleSwapRates';
import ModuleContractDeploy from '@/modules/contract/ModuleContractDeploy';

export default {
  name: 'TheDeployContractLayout',
  components: {
    TheWrapperWallet,
    ModuleSwapRates,
    ModuleContractDeploy
  }
};
</script>

<style lang="scss"></style>
