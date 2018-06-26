<template>
  <b-modal ref="password" hide-footer class="bootstrap-modal modal-software" title="Password">
    <form class="password-form">
      <input :type="show ? 'text': 'password'" name="Password" v-model="password">
      <button class="submit-button large-round-button-green-filled" type="submit" @click.prevent="unlockWallet" :disabled=" password === '' && password.length === 0 && password.length < 9">
        Unlock Wallet
      </button>
    </form>
  </b-modal>
</template>

<script>
import Wallet from 'ethereumjs-wallet'
import Worker from '@/workers/unlockWallet.worker.js'
export default {
  props: ['file'],
  data: function () {
    return {
      show: false,
      password: ''
    }
  },
  methods: {
    unlockWallet: function () {
      const self = this
      const worker = new Worker()
      worker.postMessage({type: 'unlockWallet', data: [self.file, self.password]})
      worker.onmessage = function (e) {
        // Regenerate the wallet since the worker only return an object instance. Not the whole wallet instance
        self.$store.dispatch('decryptWallet', Wallet.fromPrivateKey(Buffer.from(e.data._privKey)))
        self.$router.push({ path: 'interface' })
      }
      worker.onerror = function (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "PasswordModal.scss";
</style>
