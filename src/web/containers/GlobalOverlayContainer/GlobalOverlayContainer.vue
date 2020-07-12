<template>
  <div>
    <AccessWalletOverlays />
    <TransactionOverlays />
    <SignMessageOverlays />
  </div>
</template>

<script>
import AccessWalletOverlays from './components/AccessWallet';
import TransactionOverlays from './components/Transaction';
import SignMessageOverlays from './components/SignMessage';

export default {
  name: 'GlobalOverlayContainer',
  components: {
    AccessWalletOverlays,
    TransactionOverlays,
    SignMessageOverlays
  },
  data() {
    return {};
  }
};
</script>
