<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-deploy />
    </template>
    <template #rightColItem1>
      <the-draggable-items />
    </template>
  </the-wrapper-wallet>
</template>

<script>
export default {
  name: 'TheDeployContractLayout',
  components: {
    TheDraggableItems: () => import('@/views/layouts-wallet/TheDraggableItems'),
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet'),
    ModuleSwapRates: () => import('@/modules/swap/ModuleSwapRates'),
    ModuleContractDeploy: () =>
      import('@/modules/contract/ModuleContractDeploy')
  }
};
</script>
