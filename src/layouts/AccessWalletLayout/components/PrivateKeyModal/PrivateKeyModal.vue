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
          autocomplete="off">
      </div>
      <button
        :disabled=" privateKey === '' && privateKey.length === 0 && privateKey.length < 9"
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet">
        {{ $t("accessWallet.unlockWallet") }}
      </button>
    </form>
  </b-modal>
</template>

<script>
import { BasicWallet } from '@/wallets';

export default {
  data() {
    return {
      privateKey: ''
    };
  },
  methods: {
    unlockWallet() {
      this.$store.dispatch(
        'decryptWallet',
        BasicWallet.unlock({
          type: 'manualPrivateKey',
          manualPrivateKey: this.privateKey
        })
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
