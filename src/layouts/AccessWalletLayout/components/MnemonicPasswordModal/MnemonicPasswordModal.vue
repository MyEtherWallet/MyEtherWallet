<template>
  <b-modal
    ref="password"
    :title="$t('accessWallet.password')"
    hide-footer
    class="bootstrap-modal modal-software"
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
      <button
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet" >
        {{ $t("common.continue") }}
      </button>
    </form>
  </b-modal>
</template>

<script>
import { MnemonicWallet } from '@/wallets';
export default {
  props: {
    hardwareWalletOpen: {
      type: Function,
      default: function() {}
    },
    phrase: {
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
      MnemonicWallet.unlock({
        mnemonicPhrase: this.phrase,
        mnemonicPassword: this.password
      })
        .then(wallet => {
          // this.$refs.password.hide();  // TODO: confirm moving this to parent still functions as expected
          this.password = '';
          this.hardwareWalletOpen(wallet);
        })
        .catch(_error => {
          // eslint-disable-next-line no-console
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
@import 'MnemonicPasswordModal-desktop.scss';
@import 'MnemonicPasswordModal-tablet.scss';
@import 'MnemonicPasswordModal-mobile.scss';
</style>
