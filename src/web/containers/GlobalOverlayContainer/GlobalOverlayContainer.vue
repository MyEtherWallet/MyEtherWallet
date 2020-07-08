<template>
  <div>
    <AccessWalletOverlays />
    <TransactionOverlays />
  </div>
</template>

<script>
import AccessWalletOverlays from './components/AccessWallet';
import TransactionOverlays from './components/Transaction';

export default {
  name: 'GlobalOverlayContainer',
  components: { AccessWalletOverlays, TransactionOverlays },
  data() {
    return {};
  }
};
</script>
