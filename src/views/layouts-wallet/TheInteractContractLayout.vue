<template>
  <the-layout-wallet-grid>
    <template #leftColItem1>
      <module-contract-interact />
    </template>
    <template #rightColItem1>
      <swap />
    </template>
  </the-layout-wallet-grid>
</template>

<script>
import TheLayoutWalletGrid from '@/core/components/TheLayoutWalletGrid';

import Swap from '@/core/components/AppSwap';
import ModuleContractInteract from '@/modules/contract/ModuleContractInteract.vue';

export default {
  name: '',
  components: {
    ModuleContractInteract,
    Swap,
    TheLayoutWalletGrid
  },
  data() {}
};
</script>
