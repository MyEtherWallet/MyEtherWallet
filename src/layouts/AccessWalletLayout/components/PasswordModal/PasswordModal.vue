<template>
  <b-modal ref="password" hide-footer class="bootstrap-modal modal-software" title="Password">
    <form class="password-form">
      <div class="input-container">
        <input :type="show ? 'text': 'password'" name="Password" v-model="password" autocomplete="off" />
        <img @click.prevent="switchViewPassword" v-if="show" src="@/assets/images/icons/show-password.svg"/>
        <img @click.prevent="switchViewPassword" v-if="!show" src="@/assets/images/icons/hide-password.svg"/>
      </div>
      <p class="error" v-show="error !== ''"> {{ error }} </p>
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
  data () {
    return {
      show: false,
      password: '',
      error: ''
    }
  },
  methods: {
    unlockWallet () {
      const worker = new Worker()
      const self = this
      worker.postMessage({type: 'unlockWallet', data: [this.file, this.password]})
      worker.onmessage = function (e) {
        // Regenerate the wallet since the worker only return an object instance. Not the whole wallet instance
        self.$store.dispatch('decryptWallet', Wallet.fromPrivateKey(Buffer.from(e.data._privKey)))
        self.$router.push({ path: 'interface' })
      }
      worker.onerror = function (e) {
        self.error = e.message
      }
    },
    switchViewPassword () {
      this.show = !this.show
    }
  },
  watch: {
    password () {
      this.error = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "PasswordModal.scss";
</style>
