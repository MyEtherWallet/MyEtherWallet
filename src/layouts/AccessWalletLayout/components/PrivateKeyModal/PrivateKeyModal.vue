<template>
  <b-modal
    ref="privateKey"
    :title="$t('accessWallet.private-key.modal.title')"
    hide-footer
    class="bootstrap-modal nopadding modal-software"
    centered
    static
    lazy
    @shown="focusInput"
    @hide="privateKey = ''"
  >
    <div class="warning">
      <warning-message />
    </div>
    <div class="modal-content-block">
      <form class="private-key-form">
        <div class="input-container">
          <input
            ref="privateKeyInput"
            v-model="privateKey"
            type="text"
            name="PrivateKey"
            autocomplete="off"
            :placeholder="$t('accessWallet.private-key.modal.placeholder')"
          />
        </div>
        <standard-button
          :button-disabled="notValid"
          :options="accessWalletButtonOptions"
          class="submit-button"
          @click.native.prevent="unlockWallet"
        />
      </form>
      <div class="customer-support-block">
        <customer-support />
      </div>
    </div>
  </b-modal>
</template>

<script>
import { WalletInterface } from '@/wallets';
import { PRIV_KEY as privKeyType } from '@/wallets/bip44/walletTypes';
import { mapState } from 'vuex';
import { isHexString } from 'ethereumjs-util';
import WarningMessage from '@/components/WarningMessage';
import CustomerSupport from '@/components/CustomerSupport';
import StandardButton from '@/components/Buttons/StandardButton';
export default {
  components: {
    'customer-support': CustomerSupport,
    'warning-message': WarningMessage,
    'standard-button': StandardButton
  },
  data() {
    return {
      accessWalletButtonOptions: {
        title: this.$t('common.wallet.access'),
        buttonStyle: 'green',
        noMinWidth: true
      },
      privateKey: '',
      spinner: false
    };
  },
  computed: {
    ...mapState(['path']),
    notValid() {
      const _priv = this.privateKey.replace('0x', '');
      return !isHexString('0x' + _priv, 32);
    }
  },
  mounted() {},
  methods: {
    unlockWallet() {
      this.spinner = true;
      this.$store
        .dispatch('decryptWallet', [
          new WalletInterface(this.privateKey, false, privKeyType)
        ])
        .then(() => {
          this.privateKey = '';
          this.spinner = false;
          this.$router.push({
            path: 'interface'
          });
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
