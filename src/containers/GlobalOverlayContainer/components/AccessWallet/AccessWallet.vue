<template>
  <div>
    <Ledger />
    <Bitbox />
    <Finney />
    <Secalot />
    <KeepKey />
    <Trezor />
    <CoolWallet />
    <BCVault />
    <XWallet />
  </div>
</template>

<script>
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
  }
};
</script>
