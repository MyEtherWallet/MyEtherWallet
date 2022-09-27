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
export default {
  name: 'InteracContractLayout',
  components: {
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    ModuleContractInteract: () =>
      import('@/modules/contract/ModuleContractInteract')
  }
};
</script>
