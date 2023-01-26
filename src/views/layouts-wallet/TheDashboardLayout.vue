<template>
  <the-wrapper-wallet :total-left-col-items="2" :total-right-col-items="2">
    <template #leftColItem1>
      <module-balance />
    </template>
    <template #leftColItem2>
      <module-tokens />
    </template>
    <template #rightColItem1>
      <the-draggable-items />
    </template>
    <template #rightColItem2>
      <app-carousel />
    </template>
  </the-wrapper-wallet>
</template>

<script>
export default {
  components: {
    TheDraggableItems: () => import('@/views/layouts-wallet/TheDraggableItems'),
    AppCarousel: () => import('@/core/components/AppCarousel'),
    ModuleBalance: () => import('@/modules/balance/ModuleBalance'),
    ModuleTokens: () => import('@/modules/balance/ModuleTokens'),
    ModuleTransferHistory: () =>
      import('@/modules/transfer-history/ModuleTransferHistory'),
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet')
  }
};
</script>
