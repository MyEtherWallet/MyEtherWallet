<template>
  <b-modal
    ref="accessbymnemonicphrasepassword"
    hide-footer
    class="bootstrap-modal modal-software"
    title="Password"
    centered>
    <form class="password-form">
      <div class="input-container">
        <input
          :type="show ? 'text': 'password'"
          v-model="password"
          name="Password"
          autocomplete="off" >
        <img
          v-if="show"
          src="@/assets/images/icons/show-password.svg"
          @click.prevent="switchViewPassword">
        <img
          v-if="!show"
          src="@/assets/images/icons/hide-password.svg"
          @click.prevent="switchViewPassword">
      </div>
      <p
        v-show="error !== ''"
        class="error"> {{ error }} </p>

      <div class="accept-terms">
        <label class="checkbox-container">{{ $t("accessWallet.acceptTerms") }} <a href="/">{{ $t("common.terms") }}</a>.
          <input
            type="checkbox"
            @click="acceptedTerms = !acceptedTerms" >
          <span class="checkmark"/>
        </label>
      </div>
      <router-link
        :class="(password === '' && password.length === 0) || acceptedTerms === false ? 'disabled' : ''"
        to="/interface"
        class="submit-button large-round-button-green-filled"
        @click.prevent="unlockWallet">
        Access My Wallet
      </router-link>
    </form>

    <div class="support">
      <router-link to="/">
        <div class="support-content">
          <div class="support-icon"><img src="~@/assets/images/icons/help-center.svg"></div>
          <div class="support-label"><h5>{{ $t("common.customerSupport") }}</h5></div>
        </div>
      </router-link>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    phrase: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      password: '',
      error: '',
      acceptedTerms: false
    };
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  mounted() {
    //this.$refs.accessbymnemonicphrasepassword.show();
  },
  methods: {
    unlockWallet() {},
    switchViewPassword() {
      this.show = !this.show;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'AccessByMnemonicphrasePasswordModal.scss';
</style>
