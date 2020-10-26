<template>
  <div>
    <div class="d-block d-lg-none">
      <network mobile class="mb-4" />
      <myTokenValue mobile class="mb-4" />
      <main-content class="mb-4" />
      <tx-history title="Swap history" mobile />
    </div>
    <div class="d-none d-lg-flex">
      <div class="flex-grow-1">
        <main-content />
      </div>
      <div class="pa-4"></div>
      <div>
        <network />
        <div class="pa-4"></div>
        <tx-history title="Swap history" mobile />
        <div class="pa-4"></div>
        <myTokenValue />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>
  </div>
</template>

<script>
import Network from '@/modules/wallets/components/network/Network';
import Swap from '@/modules/wallets/components/swap/Swap';
import txHistory from '@/modules/wallets/components/transaction-history/TransactionHistory';
import myTokenValue from '@/modules/wallets/components/my-token-value/MyTokenValue';
import mainContent from './components/main-content/MainContent';

export default {
  components: {
    network: Network,
    swap: Swap,
    txHistory,
    myTokenValue,
    mainContent
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
