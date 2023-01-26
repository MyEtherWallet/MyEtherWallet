<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-interact />
    </template>
    <template #rightColItem1>
      <the-draggable-items />
    </template>
  </the-wrapper-wallet>
</template>

<script>
export default {
  name: 'InteracContractLayout',
  components: {
    TheDraggableItems: () => import('@/views/layouts-wallet/TheDraggableItems'),
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    ModuleContractInteract: () =>
      import('@/modules/contract/ModuleContractInteract')
  }
};
</script>
