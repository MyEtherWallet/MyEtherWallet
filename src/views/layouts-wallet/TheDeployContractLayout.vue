<template>
  <div class="d-flex">
    <module-contract-deploy />
    <div class="ml-4">
      <module-network />
    </div>
  </div>
</template>

<script>
import ModuleNetwork from '@/modules/network/ModuleNetwork';
import ModuleContractDeploy from '@/modules/contract/ModuleContractDeploy';

export default {
  components: {
    ModuleNetwork,
    ModuleContractDeploy
  }
};
</script>

<style lang="scss"></style>
