<template>
  <div>
    <access-wallet-overlays />
    <transaction-overlays />
  </div>
</template>

<script>
import transactionOverlays from './components/Transaction/Transaction';

export default {
  name: 'GlobalOverlayContainer',
  components: {
    transactionOverlays
  },
  data() {
    return {};
  }
};
</script>
