<template>
  <b-modal ref="password" hide-footer class="bootstrap-modal modal-software" title="Password" centered>
    <form class="password-form">
      <div class="input-container">
        <input :type="show ? 'text': 'password'" name="Password" v-model="password" autocomplete="off"/>
        <img @click.prevent="switchViewPassword" v-if="show" src="@/assets/images/icons/show-password.svg"/>
        <img @click.prevent="switchViewPassword" v-if="!show" src="@/assets/images/icons/hide-password.svg"/>
      </div>
      <p class="error" v-show="error !== ''"> {{ error }} </p>
      <button class="submit-button large-round-button-green-filled" type="submit" @click.prevent="unlockWallet">
        Unlock {{ hardwareBrand }}
      </button>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: ['walletConstructor', 'hardwareBrand'],
  data () {
    return {
      show: false,
      password: '',
      error: ''
    }
  },
  methods: {
    unlockWallet () {
      this.walletConstructor.unlock({password: this.password})
        .then((wallet) => {
          this.$emit('hardwareWalletOpen', wallet)
        })
        .catch(_error => {
          console.error(_error) // todo replace with proper error
        })
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
  @import "HardwarePasswordModal.scss";
</style>
