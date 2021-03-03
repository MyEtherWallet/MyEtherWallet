<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-send />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import ModuleSend from '@/modules/send/ModuleSend';
import TheWrapperWallet from '@/core/components/TheWrapperWallet';

export default {
  components: {
    ModuleSend,
    TheWrapperWallet
  }
};
</script>

<style lang="scss"></style>
