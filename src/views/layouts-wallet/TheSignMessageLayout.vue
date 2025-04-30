<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-message />
    </template>
    <template #rightColItem1>
      <module-trending-tokens />
    </template>
  </the-wrapper-wallet>
</template>

<script>
export default {
  components: {
    ModuleMessage: () => import('@/modules/message/ModuleMessageSign'),
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    ModuleTrendingTokens: () => import('@/modules/swap/ModuleTrendingTokens')
  }
};
</script>
