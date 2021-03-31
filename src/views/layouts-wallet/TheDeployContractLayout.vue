<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-deploy />
    </template>
    <template #rightColItem1>
      <swap />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import Swap from '@/core/components/AppSwap';
import ModuleContractDeploy from '@/modules/contract/ModuleContractDeploy.vue';

export default {
  name: 'TheDeployContractLayout',
  components: {
    TheWrapperWallet,
    Swap,
    ModuleContractDeploy
  }
};
</script>

<style lang="scss"></style>
