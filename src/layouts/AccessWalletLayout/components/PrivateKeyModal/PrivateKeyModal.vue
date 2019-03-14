<template>
  <b-modal
    ref="privateKey"
    :title="$t('accessWallet.accessByPrivateKey')"
    hide-footer
    class="bootstrap-modal nopadding modal-software"
    centered
    @shown="focusInput"
  >
    <div class="modal-content">
      <form class="private-key-form">
        <div class="input-container">
          <input
            ref="privateKeyInput"
            v-model="privateKey"
            type="text"
            name="PrivateKey"
            autocomplete="off"
            placeholder="Enter Private Key"
          />
        </div>
        <div class="not-recommended">
          {{ $t('accessWallet.notARecommendedWay') }}
        </div>
        <button
          :disabled="
            privateKey === '' &&
              privateKey.length === 0 &&
              privateKey.length < 64
          "
          class="submit-button large-round-button-green-filled"
          type="submit"
          @click.prevent="unlockWallet"
        >
          <span v-show="!spinner">{{ $t('common.accessWallet') }}</span>
          <i v-show="spinner" class="fa fa-spin fa-spinner fa-lg" />
        </button>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { WalletInterface } from '@/wallets';
import { PRIV_KEY as privKeyType } from '@/wallets/bip44/walletTypes';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      privateKey: '',
      spinner: false
    };
  },
  computed: {
    ...mapGetters({
      path: 'path'
    })
  },
  methods: {
    unlockWallet() {
      this.spinner = true;
      this.$store.dispatch('decryptWallet', [
        new WalletInterface(this.privateKey, false, privKeyType)
      ]);
      this.privateKey = '';
      this.spinner = false;
      this.$router.push({
        path: 'interface'
      });
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
