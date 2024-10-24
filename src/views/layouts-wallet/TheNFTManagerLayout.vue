<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-nft-manager />
    </template>
  </the-wrapper-wallet>
</template>

<script>
export default {
  components: {
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    ModuleNftManager: () => import('@/modules/nft-manager/ModuleNftManager')
  }
};
</script>
