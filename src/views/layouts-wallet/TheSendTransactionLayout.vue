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
      <module-tokens-value :draggable="hasHistory" />
    </template>
    <template v-if="hasHistory" #rightColItem2>
      <module-transfer-history draggable />
    </template>
  </the-wrapper-wallet>
</template>

<script setup>
import { useNotificationsStore } from '@/core/store/notifications';
import { computed, defineAsyncComponent } from 'vue';

const ModuleSend = defineAsyncComponent(() =>
  import('@/modules/send/ModuleSend')
);
const TheWrapperWallet = defineAsyncComponent(() =>
  import('@/views/components-wallet/TheWrapperWallet')
);
const ModuleTokensValue = defineAsyncComponent(() =>
  import('@/modules/balance/ModuleTokensValue')
);
const ModuleTransferHistory = defineAsyncComponent(() =>
  import('@/modules/transfer-history/ModuleTransferHistory')
);

const { txNotifications } = useNotificationsStore();

const hasHistory = computed(() => {
  return txNotifications.value && txNotifications.value.length > 0;
});

const totalRightColItems = computed(() => {
  return hasHistory.value ? 2 : 1;
});
</script>
