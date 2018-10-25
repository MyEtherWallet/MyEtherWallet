<template>
  <b-modal
    ref="privateKey"
    :title="$t('accessWallet.accessByPrivateKey')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered>
    <form class="private-key-form">
      <div class="input-container">
        <input
          v-model="privateKey"
          type="text"
          name="PrivateKey"
          autocomplete="off" >
      </div>
      <button
        :disabled=" privateKey === '' && privateKey.length === 0 && privateKey.length < 9"
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet">
        {{ $t("accessWallet.unlock") }}
      </button>
    </form>
  </b-modal>
</template>

<script>
import { WalletInterface } from '@/wallets';
import { PRIV_KEY as privKeyType } from '@/wallets/bip44/walletTypes';
export default {
  data() {
    return {
      privateKey:
        '0xcceec89b3ce8f16b1a3549332430e693f7edb5ed5b5e57f8479fab1ec665fc4d'
    };
  },
  methods: {
    unlockWallet() {
      this.$store.dispatch(
        'decryptWallet',
        new WalletInterface(this.privateKey, false, privKeyType)
      );
      this.privateKey = '';
      this.$router.push({ path: 'interface' });
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PrivateKeyModal-desktop.scss';
@import 'PrivateKeyModal-tablet.scss';
@import 'PrivateKeyModal-mobile.scss';
</style>
