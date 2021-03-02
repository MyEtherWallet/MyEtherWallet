<template>
  <the-layout-wallet-grid>
    <template #leftColItem1>
      <module-contract-deploy />
    </template>
    <template #rightColItem1>
      <swap />
    </template>
  </the-layout-wallet-grid>
</template>

<script>
import TheLayoutWalletGrid from '@/core/components/TheLayoutWalletGrid';
import Swap from '@/core/components/AppSwap';
import ModuleContractDeploy from '@/modules/contract/ModuleContractDeploy.vue';

export default {
  name: 'TheDeployContractLayout',
  components: {
    TheLayoutWalletGrid,
    Swap,
    ModuleContractDeploy
  }
};
</script>
