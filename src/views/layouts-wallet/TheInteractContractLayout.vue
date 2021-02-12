<template>
  <div class="d-flex">
    <module-contract-interact />
    <div class="ml-4">
      <module-network />
    </div>
  </div>
</template>

<script>
import ModuleNetwork from '@/modules/network/ModuleNetwork';
import ModuleContractInteract from '@/modules/contract/ModuleContractInteract';

export default {
  components: {
    ModuleNetwork,
    ModuleContractInteract
  }
};
</script>

<style lang="scss"></style>
