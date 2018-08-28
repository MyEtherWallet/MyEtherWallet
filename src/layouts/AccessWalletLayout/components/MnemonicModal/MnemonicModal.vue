<template>
  <b-modal ref="mnemonicPhrase" hide-footer class="bootstrap-modal modal-software" title="Enter Mnemonic Phrase" centered>
    <form class="private-key-form">
      <div class="input-container">
        <input type="text" name="PrivateKey" v-model="mnemonicPhrase" autocomplete="off" />
      </div>
      <button class="submit-button large-round-button-green-filled" type="submit" @click.prevent="unlockWallet" :disabled=" mnemonicPhrase === '' && mnemonicPhrase.length === 0">
        Continue
      </button>
    </form>
  </b-modal>
</template>

<script>

export default {
  props: ['openMnemonicPasswordModal'],
  data () {
    return {
      mnemonicPhrase: ''
    }
  },
  methods: {
    unlockWallet () {
      this.openMnemonicPasswordModal(this.mnemonicPhrase)
      // this.$store.dispatch('decryptWallet', MnemonicWallet.unlock({
      //   mnemonicPhrase: 'manualPrivateKey',
      //   mnemonicPassword: this.privateKey
      // }))
      // this.privateKey = ''
      // this.$router.push({ path: 'interface' })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "MnemonicModal.scss";
</style>
