<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-nft-manager />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import ModuleNftManager from '@/modules/nft-manager/ModuleNftManager';

export default {
  components: {
    TheWrapperWallet,
    ModuleNftManager
  }
};
</script>
