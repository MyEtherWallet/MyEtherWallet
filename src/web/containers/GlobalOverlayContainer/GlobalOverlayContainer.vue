<template>
  <div>
    <AccessWalletOverlays />
  </div>
</template>

<script>
import AccessWalletOverlays from './components/AccessWallet';

export default {
  name: 'GlobalOverlayContainer',
  components: { AccessWalletOverlays },
  data() {
    return {};
  }
};
</script>
