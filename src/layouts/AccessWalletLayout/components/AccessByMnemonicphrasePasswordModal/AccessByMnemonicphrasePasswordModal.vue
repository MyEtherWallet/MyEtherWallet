<template>
  <b-modal ref="accessbymnemonicphrasepassword" hide-footer class="bootstrap-modal modal-software" title="Password" centered>
    <form class="password-form">
      <div class="input-container">
        <input :type="show ? 'text': 'password'" name="Password" v-model="password" autocomplete="off" />
        <img @click.prevent="switchViewPassword" v-if="show" src="@/assets/images/icons/show-password.svg"/>
        <img @click.prevent="switchViewPassword" v-if="!show" src="@/assets/images/icons/hide-password.svg"/>
      </div>
      <p class="error" v-show="error !== ''"> {{ error }} </p>

      <div class="accept-terms">
        <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
          <input v-on:click="acceptedTerms = !acceptedTerms" type="checkbox" />
          <span class="checkmark"></span>
        </label>
      </div>
      <router-link
        to="/interface"
        class="submit-button large-round-button-green-filled"
        @click.prevent="unlockWallet"
        :class="(password === '' && password.length === 0) || acceptedTerms === false ? 'disabled' : ''">
        Access My Wallet
      </router-link>
    </form>

    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{$t("common.customerSupport")}}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: ['file'],
  data () {
    return {
      show: false,
      password: '',
      error: '',
      acceptedTerms: false
    }
  },
  methods: {
    unlockWallet () {

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
  @import "AccessByMnemonicphrasePasswordModal.scss";
</style>
