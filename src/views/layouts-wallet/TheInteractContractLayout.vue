<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-interact />
    </template>
    <template #rightColItem1>
      <swap />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import Swap from '@/core/components/AppSwap';
import ModuleContractInteract from '@/modules/contract/ModuleContractInteract.vue';

export default {
  name: '',
  components: {
    ModuleContractInteract,
    Swap,
    TheWrapperWallet
  },
  data() {}
};
</script>

<style lang="scss"></style>
