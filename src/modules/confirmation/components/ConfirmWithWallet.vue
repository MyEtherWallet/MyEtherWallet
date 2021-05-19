<template>
  <div class="mt-10">
    <div class="text-center">
      <div>
        <mew-icon
          v-if="!hasIcon"
          class="border-radius--5px custom-icon-style"
          :icon-name="instance.identifier"
          :img-height="50"
        />
        <img v-else :src="icons[instance.identifier]" height="50px" />
      </div>
    </div>
    <div class="text-center mb-5">
      <p>{{ bodyText }}</p>
    </div>
    <v-progress-linear
      v-if="!signed"
      indeterminate
      color="primary"
      class="mb-3"
    ></v-progress-linear>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ledger from '@/assets/images/hardware-wallets/logo-ledger.svg';
import trezor from '@/assets/images/hardware-wallets/logo-trezor.svg';
import keepkey from '@/assets/images/hardware-wallets/logo-keepkey.png';
import secalot from '@/assets/images/hardware-wallets/logo-secalot.png';

export default {
  props: {
    isSwap: {
      type: Boolean,
      default: false
    },
    txLength: {
      type: Number,
      default: 1
    },
    signed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('wallet', ['instance']),
    bodyText() {
      const walletNames = {
        ledger: 'Ledger',
        trezor: 'Trezor',
        bitbox: 'BitBox',
        bitbox02: 'BitBox 02',
        secalot: 'Secalot',
        keepkey: 'KeepKey',
        mewconnect: 'MewConnect',
        walletConnect: 'Wallet Connect',
        web3Wallet: 'Web3 Wallet',
        finney: 'Finney',
        xwallet: 'Xwallet',
        bcVault: 'BC Vault',
        coolWallet: 'Cool Wallet',
        walletLink: 'Wallet Link'
      };
      return `Approve ${this.txLength} ${
        this.txLength > 1 ? 'transactions' : 'transaction'
      } on ${walletNames[this.instance.identifier]}.`;
    },
    icons() {
      return {
        ledger: ledger,
        trezor: trezor,
        secalot: secalot,
        keepkey: keepkey
      };
    },
    hasIcon() {
      return this.icons[this.instance.identifier];
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-icon-style {
  border: 1px solid var(--v-basicOutlineActive-base);
}
</style>
