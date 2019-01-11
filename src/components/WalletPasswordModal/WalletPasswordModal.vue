<template>
  <div class="wallet-password-modal">
    <b-modal
      ref="walletpassword"
      title="Passphrase"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
    >
      <div class="modal-contents">
        <div class="passphrase-container">
          <div class="input-container">
            <div class="input-headers">
              <p>Passphrase</p>
              <span @click="clear">Clear</span>
            </div>
            <input v-model="passphrase" type="password" />
          </div>
        </div>
        <div class="button-block">
          <button :disabled="!acknowledgedTerms" @click="submitPassword">
            Access My Wallet
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import StandardInput from '@/components/StandardInput';
import Standardbutton from '@/components/Buttons/StandardButton';

export default {
  name: 'WalletPassword',
  components: {
    'standard-input': StandardInput,
    'standard-button': Standardbutton
  },
  data() {
    return {
      passphrase: '',
      callback: () => {},
      identifier: {},
      acknowledgedTerms: false
    };
  },
  created() {
    this.$eventHub.$on('showHardwarePassword', (identifier, callback) => {
      this.$refs.walletpassword.show();
      this.callback = callback;
      this.identifier = identifier;
    });
  },
  methods: {
    submitPassword() {
      this.callback(this.passphrase);
    },
    clear() {
      this.passphrase = '';
      this.acknowledgedTerms = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletPasswordModal.scss';
</style>
