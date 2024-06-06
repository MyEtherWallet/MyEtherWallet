<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-nft-manager />
    </template>
  </the-wrapper-wallet>
</template>

<script setup>
import TheWrapperWallet from '@/views/components-wallet/TheWrapperWallet.vue';
import ModuleNftManager from '@/modules/nft-manager/ModuleNftManager.vue';
</script>
