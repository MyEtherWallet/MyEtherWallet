<template>
  <div class="mt-10">
    <div class="text-center">
      <div>
        <mew-icon
          v-if="instance.icon.type === 'mew-icon'"
          class="border-radius--5px custom-icon-style"
          :icon-name="instance.icon.value"
          :img-height="100"
        />
        <img v-else :src="instance.icon.value" height="50px" />
      </div>
    </div>
    <div :class="[error !== '' ? 'error--text' : '', 'text-center mb-5']">
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
export default {
  props: {
    txLength: {
      type: Number,
      default: 1
    },
    signed: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('wallet', ['instance']),
    bodyText() {
      console.log(this.instance, this.error);
      if (this.error !== '') return this.error;
      const walletNames = {
        ledger: 'Ledger',
        trezor: 'Trezor',
        bitbox: 'BitBox',
        bitbox02: 'BitBox 02',
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
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-icon-style {
  border: 1px solid var(--v-basicOutlineActive-base);
}
</style>
