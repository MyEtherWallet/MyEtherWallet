<template>
  <b-modal
    ref="mnemonicPhrase"
    hide-footer
    class="bootstrap-modal modal-software"
    title="Enter Mnemonic Phrase"
    centered>
    <form class="private-key-form">
      <div class="input-container">
        <input
          v-model="mnemonicPhrase"
          type="text"
          name="PrivateKey"
          autocomplete="off" >
      </div>
      <button
        :disabled=" mnemonicPhrase === '' && mnemonicPhrase.length === 0"
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet">
        Continue
      </button>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    openMnemonicPasswordModal: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      mnemonicPhrase: ''
    };
  },
  methods: {
    unlockWallet() {
      this.openMnemonicPasswordModal(this.mnemonicPhrase);
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'MnemonicModal.scss';
</style>
