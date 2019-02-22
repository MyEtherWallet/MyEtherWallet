<template>
  <b-modal
    ref="password"
    :title="$t('accessWallet.password')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered
    @shown="focusInput"
  >
    <form class="password-form">
      <div class="input-container">
        <input
          v-validate="'required'"
          ref="passwordInput"
          :type="show ? 'text' : 'password'"
          v-model="password"
          name="Password"
          autocomplete="off"
        />
        <img
          v-if="show"
          src="@/assets/images/icons/show-password.svg"
          @click.prevent="switchViewPassword"
        />
        <img
          v-if="!show"
          src="@/assets/images/icons/hide-password.svg"
          @click.prevent="switchViewPassword"
        />
      </div>
      <p v-show="error !== ''" class="error">{{ error }}</p>
      <p v-show="errors.has('password')" class="error">
        {{ errors.first('password') }}
      </p>
      <button
        :class="[
          errors.has('password') || password.length === 0 ? 'disabled' : '',
          'submit-button large-round-button-green-filled'
        ]"
        type="submit"
        @click.prevent="unlockWallet"
      >
        {{ $t('accessWallet.unlock') }} {{ hardwareBrand }}
      </button>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    walletConstructor: {
      type: Function,
      default: function() {}
    },
    hardwareBrand: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      password: '',
      error: ''
    };
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  methods: {
    focusInput() {
      this.password == '';
      this.$refs.passwordInput.focus();
    },
    unlockWallet() {
      this.walletConstructor('', this.password)
        .then(_newWallet => {
          this.$emit('hardwareWalletOpen', _newWallet);
        })
        .catch(this.walletConstructor.errorHandler);
    },
    switchViewPassword() {
      this.show = !this.show;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'HardwarePasswordModal.scss';
</style>
