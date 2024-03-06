<template>
  <the-wrapper-wallet
    :total-left-col-items="1"
    has-draggable
    :total-right-col-items="totalRightColumns"
  >
    <template #leftColItem1>
      <module-swap
        :is-available="hasSwap"
        :from-token="fromToken"
        :to-token="toToken"
        :amount="amount"
      />
    </template>
    <template #rightColItem1>
      <module-tokens-value :draggable="hasHistory" />
    </template>
    <template v-if="hasHistory && hasSwap" #rightColItem2>
      <module-transfer-history draggable :is-swap="true" />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters } from 'vuex';

import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { COMMON } from '@/modules/analytics-opt-in/handlers/configs/events.js';

const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';

export default {
  components: {
    TheWrapperWallet: () =>
      import('@/views/components-wallet/TheWrapperWallet'),
    ModuleSwap: () => import('@/modules/swap/ModuleSwap'),
    ModuleTokensValue: () => import('@/modules/balance/ModuleTokensValue'),
    ModuleTransferHistory: () =>
      import('@/modules/transfer-history/ModuleTransferHistory')
  },
  mixins: [handlerAnalytics],
  props: {
    fromToken: {
      type: String,
      default: ETH_TOKEN
    },
    toToken: {
      type: String,
      default: DAI_TOKEN
    },
    amount: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters('global', ['hasSwap']),
    ...mapGetters('notifications', ['swapNotifications']),
    hasHistory() {
      return this.swapNotifications && this.swapNotifications.length > 0;
    },
    totalRightColumns() {
      return this.hasHistory && this.hasSwap ? 2 : 1;
    }
  },
  mounted() {
    this.trackSwapAmplitude(COMMON.PAGE_SHOWN);
  }
};
</script>
