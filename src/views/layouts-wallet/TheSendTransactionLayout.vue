<template>
  <the-layout-wallet-grid :total-right-col-items="1">
    <template #leftColItem1>
      <module-send />
    </template>
  </the-layout-wallet-grid>
</template>

<script>
import ModuleSend from '@/modules/send/ModuleSend';
import TheLayoutWalletGrid from '@/core/components/TheLayoutWalletGrid';

export default {
  components: {
    ModuleSend,
    TheLayoutWalletGrid
  }
};
</script>

<style lang="scss"></style>
