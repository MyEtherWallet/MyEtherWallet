<template>
  <b-modal
    ref="password"
    :title="$t('accessWallet.password')"
    hide-footer
    class="bootstrap-modal modal-software"
    centered
    static
    lazy
    @shown="focusInput"
  >
    <form class="password-form">
      <validation-provider v-slot="{ errors }" rules="required">
        <div class="input-container">
          <input
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
        <p v-show="errors[0]" class="error">
          {{ errors[0] }}
        </p>
        <button
          :class="[
            errors[0] || password.length === 0 ? 'disabled' : '',
            'submit-button large-round-button-green-filled'
          ]"
          type="submit"
          @click.prevent="unlockWallet"
        >
          {{ $t('accessWallet.unlock') }} {{ hardwareBrand }}
        </button>
      </validation-provider>
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
