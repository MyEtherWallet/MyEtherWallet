<template>
  <b-modal
    ref="walletPassword"
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
        <button @click="submitPasshrase">Access My Wallet</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'WalletPassword',
  props: {
    callback: {
      type: Function,
      default: () => {}
    },
    identifier: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      passphrase: ''
    };
  },
  methods: {
    submitPasshrase() {
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
@import 'WalletPassphraseModal.scss';
</style>
