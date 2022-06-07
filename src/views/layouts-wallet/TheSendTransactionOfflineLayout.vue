<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-send-offline />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import ModuleSendOffline from '@/modules/send-offline/ModuleSendOffline';
import TheWrapperWallet from '@/core/components/TheWrapperWallet';

export default {
  components: {
    ModuleSendOffline,
    TheWrapperWallet
  }
};
</script>
