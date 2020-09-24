<template>
  <div>
    <ledger :open="ledger" @close="ledger = false" />
    <bitbox :open="bitbox" @close="bitbox = false" />
    <finney :open="finney" @close="finney = false" />
    <secalot :open="secalot" @close="secalot = false" />
    <keepKey :open="keepKey" @close="keepKey = false" />
    <trezor :open="trezor" @close="trezor = false" />
    <cool-wallet :open="coolWallet" @close="coolWallet = false" />
    <bc-vault :open="bcVault" @close="bcVault = false" />
    <x-wallet :open="xWallet" @close="xWallet = false" />
  </div>
</template>

<script>
import ledger from './HardwareWallets/Ledger/Ledger';
import bitbox from './HardwareWallets/Bitbox/Bitbox';
import finney from './HardwareWallets/Finney/Finney';
import secalot from './HardwareWallets/Secalot/Secalot';
import keepKey from './HardwareWallets/KeepKey/KeepKey';
import trezor from './HardwareWallets/Trezor/Trezor';
import coolWallet from './HardwareWallets/CoolWallet/CoolWallet';
import bcVault from './HardwareWallets/BCVault/BCVault';
import xWallet from './HardwareWallets/XWallet/XWallet';

export default {
  components: {
    ledger,
    bitbox,
    finney,
    secalot,
    keepKey,
    trezor,
    coolWallet,
    bcVault,
    xWallet
  },
  props: {
    open: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      ledger: false,
      bitbox: false,
      finney: false,
      secalot: false,
      keepKey: false,
      trezor: false,
      coolWallet: false,
      bcVault: false,
      xWallet: false
    };
  },
  watch: {
    open(newVal) {
      if (newVal === '') {
        return;
      }

      switch (newVal.toLowerCase()) {
        case 'ledger':
          this.ledger = true;
          break;
        case 'bitbox':
          this.bitbox = true;
          break;
        case 'finney':
          this.finney = true;
          break;
        case 'secalot':
          this.secalot = true;
          break;
        case 'keepkey':
          this.keepKey = true;
          break;
        case 'trezor':
          this.trezor = true;
          break;
        case 'coolwallet':
          this.coolWallet = true;
          break;
        case 'bcvault':
          this.bcVault = true;
          break;
        case 'xwallet':
          this.xWallet = true;
          break;
        default:
      }

      this.$emit('reset');
      console.log(newVal);
    }
  }
};
</script>
