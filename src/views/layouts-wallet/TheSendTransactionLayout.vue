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
import { mapGetters } from 'vuex';

export default {
  components: {
    ModuleSend: () => import('@/modules/send/ModuleSend'),
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet'),
    ModuleTokensValue: () => import('@/modules/balance/ModuleTokensValue'),
    ModuleTransferHistory: () =>
      import('@/modules/transfer-history/ModuleTransferHistory')
  },
  computed: {
    ...mapGetters('notifications', ['txNotifications']),
    hasHistory() {
      return this.txNotifications && this.txNotifications.length > 0;
    }
  }
};
</script>
