<template>
  <b-modal ref="mnemonic" hide-footer class="bootstrap-modal modal-software" title="mnemonic">
    <form class="mnemonic-form">
      <div class="input-container">
        <input type="text" name="mnemonic" v-model="mnemonic" autocomplete="off">
      </div>
      <button class="submit-button large-round-button-green-filled" type="submit" @click.prevent="unlockWallet" :disabled=" mnemonic === '' && mnemonic.length === 0">
        {{ $t("common.unlockWallet") }}
      </button>
    </form>
  </b-modal>
</template>

<script>
const hd = require('ethereumjs-wallet/hdkey')
const bip39 = require('bip39')
export default {
  data () {
    return {
      mnemonic: ''
    }
  },
  methods: {
    unlockWallet () {
      this.$store.dispatch('decryptWallet', hd.fromMasterSeed(bip39.mnemonicToSeed(this.mnemonic)).derivePath("m/44'/60'/0'/0/0").getWallet())
      this.mnemonic = ''
      this.$router.push({ path: 'interface' })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "MnemonicModal";
</style>
