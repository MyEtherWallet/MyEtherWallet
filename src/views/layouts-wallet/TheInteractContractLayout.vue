<template>
  <div class="d-flex justify-center full-width pa-3">
    <module-contract-interact class="flex-grow-1" />
    <div class="pl-5">
      <module-network />
      <swap class="mt-3" />
    </div>
  </div>
</template>

<script>
import ModuleNetwork from '@/modules/network/ModuleNetwork';
import Swap from '@/core/components/AppSwap';
import ModuleContractInteract from '@/modules/contract/ModuleContractInteract.vue';

export default {
  name: '',
  components: {
    ModuleContractInteract,
    Swap,
    ModuleNetwork
  },
  data() {}
};
</script>
