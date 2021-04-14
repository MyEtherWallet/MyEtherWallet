<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <div class="border-radius--5px">
        <mew-icon :icon-name="instance.identifier" :img-height="30" />
      </div>
    </v-col>
    <v-col cols="12" class="text-center mb-5">
      <p>{{ bodyText }}</p>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
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
    }
  }
};
</script>
