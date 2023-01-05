<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-bridge
        :is-available="hasSwap"
        :from-token="fromToken"
        :to-token="toToken"
        :amount="amount"
      />
    </template>
    <template #rightColItem1>
      <module-tokens-value />
    </template>
    <template v-if="hasHistory && hasSwap" #rightColItem2>
      <module-transfer-history :is-swap="true" />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters } from 'vuex';

const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f'; // Set to wrapped ETH on MATIC

export default {
  components: {
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet'),
    ModuleBridge: () => import('@/modules/bridge/ModuleBridge'),
    ModuleTokensValue: () => import('@/modules/balance/ModuleTokensValue'),
    ModuleTransferHistory: () =>
      import('@/modules/transfer-history/ModuleTransferHistory')
  },
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
    }
  }
};
</script>
