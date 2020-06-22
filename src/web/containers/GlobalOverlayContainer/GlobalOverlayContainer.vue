<template>
  <div>
    <AccessWalletLedger
      :open="openAccessWalletLedger"
      :close="closeAccessWalletLedger"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AccessWalletLedger from './components/AccessWallet/HardwareWallets/Ledger';

export default {
  name: 'GlobalOverlayContainer',
  components: { AccessWalletLedger },
  data() {
    return {};
  },
  computed: mapState({
    openAccessWalletLedger: state => state.overlays.accessWalletLedger.isOpen
  }),
  methods: {
    closeAccessWalletLedger() {
      this.$store.commit('closeOverlay', 'accessWalletLedger');
    }
  }
};
</script>
