<template>
  <the-wrapper-wallet
    :total-left-col-items="1"
    has-draggable
    :total-right-col-items="totalRightColItems"
  >
    <template #leftColItem1>
      <module-send />
    </template>
    <template #rightColItem1>
      <module-trending-tokens draggable />
    </template>
    <template #rightColItem2>
      <module-tokens-value draggable />
    </template>
    <template v-if="hasHistory" #rightColItem3>
      <module-transfer-history draggable />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
    ModuleSend: () => import('@/modules/send/ModuleSend'),
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    ModuleTokensValue: () => import('@/modules/balance/ModuleTokensValue'),
    ModuleTransferHistory: () =>
      import('@/modules/transfer-history/ModuleTransferHistory'),
    ModuleTrendingTokens: () => import('@/modules/swap/ModuleTrendingTokens')
  },
  computed: {
    ...mapGetters('notifications', ['txNotifications']),
    hasHistory() {
      return this.txNotifications && this.txNotifications.length > 0;
    },
    totalRightColItems() {
      return this.hasHistory ? 3 : 2;
    }
  }
};
</script>
