<template>
  <b-modal
    ref="privateKey"
    :title="$t('accessWallet.accessByPrivateKey')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered
    @shown="focusInput"
  >
    <form class="private-key-form">
      <div class="input-container">
        <input
          ref="privateKeyInput"
          v-model="privateKey"
          type="text"
          name="PrivateKey"
          autocomplete="off"
        />
      </div>
      <button
        :disabled="
          privateKey === '' && privateKey.length === 0 && privateKey.length < 9
        "
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet"
      >
        {{ $t('accessWallet.unlock') }}
      </button>
    </form>
  </b-modal>
</template>

<script>
import { WalletInterface } from '@/wallets';
import { PRIV_KEY as privKeyType } from '@/wallets/bip44/walletTypes';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      privateKey: ''
    };
  },
  computed: {
    ...mapGetters({
      path: 'path'
    })
  },
  methods: {
    unlockWallet() {
      console.log(this.path);
      this.$store.dispatch('decryptWallet', [
        new WalletInterface(this.privateKey, false, privKeyType)
      ]);
      this.privateKey = '';
      this.$router.push({ path: this.path !== '' ? this.path : 'interface' });
      this.$store.dispatch('setLastPath', '');
    },
    focusInput() {
      this.$refs.privateKeyInput.focus();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PrivateKeyModal-desktop.scss';
@import 'PrivateKeyModal-tablet.scss';
@import 'PrivateKeyModal-mobile.scss';
</style>
