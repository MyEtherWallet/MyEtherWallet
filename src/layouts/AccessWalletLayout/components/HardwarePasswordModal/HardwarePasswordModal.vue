<template>
  <b-modal
    ref="password"
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
          autocomplete="off">
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
      <button
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet">
        Unlock {{ hardwareBrand }}
      </button>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    walletConstructor: {
      type: Object,
      default: function() {
        return {};
      }
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
    unlockWallet() {
      this.walletConstructor
        .unlock({ password: this.password })
        .then(wallet => {
          this.$emit('hardwareWalletOpen', wallet);
        })
        .catch(_error => {
          // eslint-disable-next-line
          console.error(_error); // todo replace with proper error
        });
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
