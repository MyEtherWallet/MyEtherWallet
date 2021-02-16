<template>
  <div class="d-flex full-width pa-3">
    <module-contract-deploy class="flex-grow-1" />
    <div class="pl-5">
      <network />
      <swap class="mt-3" />
    </div>
  </div>
</template>

<script>
import Network from '@/modules/network/ModuleNetwork';
import Swap from '@/components/swap/Swap';
import ModuleContractDeploy from '@/modules/contract/ModuleContractDeploy.vue';

export default {
  name: '',
  components: {
    Network,
    Swap,
    ModuleContractDeploy
  }
};
</script>
