<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-send />
    </template>
    <template #rightColItem1>
      <module-tokens-value />
    </template>
    <template v-if="hasHistory" #rightColItem2>
      <module-transfer-history />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import ModuleSend from '@/modules/send/ModuleSend';
import TheWrapperWallet from '@/core/components/TheWrapperWallet';
import ModuleTokensValue from '@/modules/balance/ModuleTokensValue';
import ModuleTransferHistory from '@/modules/transfer-history/ModuleTransferHistory';
import { mapGetters } from 'vuex';

export default {
  components: {
    ModuleSend,
    TheWrapperWallet,
    ModuleTokensValue,
    ModuleTransferHistory
  },
  computed: {
    ...mapGetters('notifications', ['txNotifications']),
    hasHistory() {
      return this.txNotifications && this.txNotifications.length > 0;
    }
  }
};
</script>

<style lang="scss"></style>
