<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-send-offline />
    </template>
  </the-wrapper-wallet>
</template>

<script>
export default {
  components: {
    ModuleSendOffline: () => import('@/modules/send-offline/ModuleSendOffline'),
    TheWrapperWallet: () => import('@/views/components-wallet/TheWrapperWallet')
  }
};
</script>
