<template>
  <div>
    <Ledger :open="openLedger" :close="closeLedger" />
    <Bitbox :open="openBitbox" :close="closeBitbox" />
    <Finney :open="openFinney" :close="closeFinney" />
    <Secalot :open="openSecalot" :close="closeSecalot" />
    <KeepKey :open="openKeepKey" :close="closeKeepKey" />
    <Trezor :open="openTrezor" :close="closeTrezor" />
    <CoolWallet :open="openCoolWallet" :close="closeCoolWallet" />
    <BCVault :open="openBCVault" :close="closeBCVault" />
    <XWallet :open="openXWallet" :close="closeXWallet" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Ledger from './HardwareWallets/Ledger';
import Bitbox from './HardwareWallets/Bitbox';
import Finney from './HardwareWallets/Finney';
import Secalot from './HardwareWallets/Secalot';
import KeepKey from './HardwareWallets/KeepKey';
import Trezor from './HardwareWallets/Trezor';
import CoolWallet from './HardwareWallets/CoolWallet';
import BCVault from './HardwareWallets/BCVault';
import XWallet from './HardwareWallets/XWallet';

export default {
  components: {
    Ledger,
    Bitbox,
    Finney,
    Secalot,
    KeepKey,
    Trezor,
    CoolWallet,
    BCVault,
    XWallet
  },
  computed: mapState({
    openLedger: state => state.overlays.accessWalletLedger.isOpen,
    openBitbox: state => state.overlays.accessWalletBitbox.isOpen,
    openFinney: state => state.overlays.accessWalletFinney.isOpen,
    openSecalot: state => state.overlays.accessWalletSecalot.isOpen,
    openKeepKey: state => state.overlays.accessWalletKeepKey.isOpen,
    openTrezor: state => state.overlays.accessWalletTrezor.isOpen,
    openCoolWallet: state => state.overlays.accessWalletCoolWallet.isOpen,
    openBCVault: state => state.overlays.accessWalletBCVault.isOpen,
    openXWallet: state => state.overlays.accessWalletXWallet.isOpen
  }),
  methods: {
    closeLedger() {
      this.$store.commit('closeOverlay', 'accessWalletLedger');
    },
    closeBitbox() {
      this.$store.commit('closeOverlay', 'accessWalletBitbox');
    },
    closeFinney() {
      this.$store.commit('closeOverlay', 'accessWalletFinney');
    },
    closeSecalot() {
      this.$store.commit('closeOverlay', 'accessWalletSecalot');
    },
    closeKeepKey() {
      this.$store.commit('closeOverlay', 'accessWalletKeepKey');
    },
    closeTrezor() {
      this.$store.commit('closeOverlay', 'accessWalletTrezor');
    },
    closeCoolWallet() {
      this.$store.commit('closeOverlay', 'accessWalletCoolWallet');
    },
    closeBCVault() {
      this.$store.commit('closeOverlay', 'accessWalletBCVault');
    },
    closeXWallet() {
      this.$store.commit('closeOverlay', 'accessWalletXWallet');
    }
  }
};
</script>
