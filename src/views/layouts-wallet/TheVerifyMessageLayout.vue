<template>
  <the-wrapper-wallet>
    <template #leftColItem1> <module-message /> </template>
  </the-wrapper-wallet>
</template>

<script>
import ModuleMessage from '@/modules/message/ModuleMessageVerify';
import TheWrapperWallet from '@/core/components/TheWrapperWallet';

export default {
  components: {
    ModuleMessage,
    TheWrapperWallet
  }
};
</script>
