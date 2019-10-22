<template>
  <div class="wallet-password-modal">
    <b-modal
      ref="walletPassword"
      title="Passphrase"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
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
          <button @click="submitPassword">Access My Wallet</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'WalletPassword',
  data() {
    return {
      passphrase: '',
      callback: () => {},
      identifier: {}
    };
  },
  mounted() {
    this.$eventHub.$on('showHardwarePassword', (identifier, callback) => {
      this.$refs.walletPassword.show();
      this.callback = callback;
      this.identifier = identifier;
    });
  },
  beforeDestroy() {
    this.$eventHub.$off('showHardwarePassword');
  },
  methods: {
    submitPassword() {
      this.callback(this.passphrase);
      this.passphrase = '';
    },
    clear() {
      this.passphrase = '';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'WalletPasswordModal.scss';
</style>
