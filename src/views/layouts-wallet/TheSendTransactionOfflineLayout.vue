<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-send-offline />
    </template>
  </the-wrapper-wallet>
</template>

<script setup>
import TheWrapperWallet from '@/views/components-wallet/TheWrapperWallet.vue';
import ModuleSendOffline from '@/modules/send-offline/ModuleSendOffline.vue';
</script>
