<template>
  <div>
    <ledger />
    <bitbox />
    <finney />
    <secalot />
    <keepKey />
    <trezor />
    <cool-wallet />
    <bc-vault />
    <x-wallet />
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
  }
};
</script>
