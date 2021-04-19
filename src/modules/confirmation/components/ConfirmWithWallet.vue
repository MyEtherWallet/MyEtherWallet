<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <div>
        <mew-icon
          class="border-radius--5px custom-icon-style"
          :icon-name="instance.identifier"
          :img-height="50"
          v-if="!hasIcon"
        />
        <img v-else :src="icons[instance.identifier]" height="50px" />
      </div>
    </v-col>
    <v-col cols="12" class="text-center mb-5">
      <p>{{ bodyText }}</p>
    </v-col>
  </v-row>
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
      type: String,
      default: 'Swap'
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
      return `Please confirm ${this.isSwap ? 'swap' : ''} transaction with ${
        walletNames[this.instance.identifier]
      }`;
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
