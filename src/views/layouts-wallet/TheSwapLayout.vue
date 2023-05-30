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
    <template #rightColItem2>
      <div></div>
    </template>
    <template v-if="hasHistory && hasSwap" #rightColItem3>
      <module-transfer-history draggable :is-swap="true" />
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters } from 'vuex';

const ETH_TOKEN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const DAI_TOKEN = '0x6b175474e89094c44da98b954eedeac495271d0f';

export default {
  components: {
    TheWrapperWallet: () => import('@/core/components/TheWrapperWallet'),
    ModuleSwap: () => import('@/modules/swap/ModuleSwap'),
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
    },
    totalRightColumns() {
      return this.hasHistory && this.hasSwap ? 3 : 2;
    }
  }
};
</script>

<style lang="scss" scoped>
.prototype-button {
  background: -webkit-linear-gradient(
    273deg,
    rgb(197, 73, 255) 0%,
    rgb(150, 74, 255) 81%,
    rgb(138, 74, 255) 100%
  );
  background: -o-linear-gradient(
    273deg,
    rgb(197, 73, 255) 0%,
    rgb(150, 74, 255) 81%,
    rgb(138, 74, 255) 100%
  );
  background: -ms-linear-gradient(
    273deg,
    rgb(197, 73, 255) 0%,
    rgb(150, 74, 255) 81%,
    rgb(138, 74, 255) 100%
  );
  background: -moz-linear-gradient(
    273deg,
    rgb(197, 73, 255) 0%,
    rgb(150, 74, 255) 81%,
    rgb(138, 74, 255) 100%
  );
  background: linear-gradient(
    177deg,
    rgb(197, 73, 255) 0%,
    rgb(150, 74, 255) 81%,
    rgb(138, 74, 255) 100%
  );
}
</style>
