<template>
  <div>
    <Ledger :open="openLedger" :close="closeLedger" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Ledger from './HardwareWallets/Ledger';

export default {
  components: { Ledger },
  computed: mapState({
    openLedger: state => state.overlays.accessWalletLedger.isOpen
  }),
  methods: {
    closeLedger() {
      this.$store.commit('closeOverlay', 'accessWalletLedger');
    }
  }
};
</script>
