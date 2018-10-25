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
        '0x9b8231364934d1904a031ae64478b679c513ce727faa346d85b9a9aa4319850b'
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
