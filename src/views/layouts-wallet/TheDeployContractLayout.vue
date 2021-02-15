<template>
  <div class="d-flex">
    <module-contract-deploy class="flex-grow-1" />
    <div>
      <network />
      <swap />
    </div>
  </div>
</template>

<script>
import Network from '@/modules/network/ModuleNetwork';
import Swap from '@/components/swap/Swap';
import ModuleContractDeploy from '@/modules/contract/ModuleContractDeploy.vue';

export default {
  name: 'ModuleContractDeploy',
  components: {
    Network,
    Swap,
    ModuleContractDeploy
  }
};
</script>
