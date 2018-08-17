<template>
  <b-modal ref="privateKey" hide-footer class="bootstrap-modal modal-software" title="PrivateKey" centered>
    <form class="private-key-form">
      <div class="input-container">
        <input type="text" name="PrivateKey" v-model="privateKey" autocomplete="off" />
      </div>
      <button class="submit-button large-round-button-green-filled" type="submit" @click.prevent="unlockWallet" :disabled=" privateKey === '' && privateKey.length === 0 && privateKey.length < 9">
        Unlock Wallet
      </button>
    </form>
  </b-modal>
</template>

<script>
// import Wallet from 'ethereumjs-wallet'
import { BasicWallet } from '@/helpers/web3-overide/software'

export default {
  data () {
    return {
      privateKey: ''
    }
  },
  methods: {
    unlockWallet () {
      this.$store.dispatch('decryptWallet', BasicWallet.unlockWallet({
        type: 'manualPrivateKey',
        manualPrivateKey: this.privateKey
      }))
      this.privateKey = ''
      this.$router.push({ path: 'interface' })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "PrivateKeyModal.scss";
</style>
