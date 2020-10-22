<template>
  <div>
    <div class="d-block d-lg-none">
      <network mobile class="mb-4" />
      <myEthBalance mobile class="mb-4" />
      <main-content class="mb-4" />
      <tx-history title="Transaction history" mobile />
    </div>

    <div class="d-none d-lg-flex">
      <div class="flex-grow-1">
        <main-content />
      </div>
      <div class="pa-4"></div>
      <div>
        <network />
        <div class="pa-4"></div>
        <tx-history title="Transaction history" />
        <div class="pa-4"></div>
        <myEthBalance />
        <div class="pa-4"></div>
        <swap />
      </div>
    </div>
  </div>
</template>

<script>
import network from '@/modules/wallets/components/network/Network';
import myEthBalance from '@/modules/wallets/components/my-eth-balance/MyEthBalance';
import txHistory from '@/modules/wallets/components/transaction-history/TransactionHistory';
import swap from '@/modules/wallets/components/swap/Swap';
import mainContent from './components/main-content/MainContent';

export default {
  components: {
    network,
    myEthBalance,
    txHistory,
    swap,
    mainContent
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
