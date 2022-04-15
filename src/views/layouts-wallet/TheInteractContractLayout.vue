<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-interact />
    </template>
    <template #rightColItem1>
      <module-swap-rates />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import ModuleSwapRates from '@/modules/swap/ModuleSwapRates';
import ModuleContractInteract from '@/modules/contract/ModuleContractInteract';

export default {
  name: 'InteracContractLayout',
  components: {
    ModuleContractInteract,
    ModuleSwapRates,
    TheWrapperWallet
  }
};
</script>

<style lang="scss"></style>
