<template>
  <div class="d-flex full-width pa-3">
    <module-contract-deploy class="flex-grow-1" />
    <network class="pl-5" />
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
