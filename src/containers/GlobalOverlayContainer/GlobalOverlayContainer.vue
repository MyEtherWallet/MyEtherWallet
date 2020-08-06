<template>
  <div>
    <access-wallet-overlays />
    <transaction-overlays />
    <sign-message-overlays />
  </div>
</template>

<script>
import accessWalletOverlays from './components/AccessWallet/AccessWallet';
import transactionOverlays from './components/Transaction/Transaction';
import signMessageOverlays from './components/SignMessage/SignMessage';

export default {
  name: 'GlobalOverlayContainer',
  components: {
    accessWalletOverlays,
    transactionOverlays,
    signMessageOverlays
  },
  data() {
    return {};
  }
};
</script>
