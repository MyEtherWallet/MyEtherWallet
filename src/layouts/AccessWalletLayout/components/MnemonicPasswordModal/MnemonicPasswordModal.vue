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
          ref="mnemonicPasswordInput"
          :type="show ? 'text' : 'password'"
          v-model="password"
          name="Password"
          autocomplete="off"
          placeholder="Enter password"
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
      <div class="not-recommended">
        {{ $t('accessWallet.notARecommendedWay') }}
      </div>
      <button
        class="submit-button large-round-button-green-filled"
        type="submit"
        @click.prevent="unlockWallet"
      >
        <span v-show="!spinner"> {{ $t('common.continue') }} </span>
        <i v-show="spinner" class="fa fa-spin fa-spinner fa-lg" />
      </button>
    </form>
  </b-modal>
</template>

<script>
import { MnemonicWallet } from '@/wallets';
import { Toast } from '@/helpers';
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
      error: '',
      spinner: false
    };
  },
  watch: {
    password() {
      this.error = '';
    }
  },
  methods: {
    unlockWallet() {
      this.spinner = true;
      MnemonicWallet(this.phrase, this.password)
        .then(wallet => {
          // this.$refs.password.hide();  // TODO: confirm moving this to parent still functions as expected
          this.password = '';
          this.spinner = false;
          this.hardwareWalletOpen(wallet);
        })
        .catch(e => {
          this.password = '';
          this.spinner = false;
          this.error = e;
          Toast.responseHandler(e, Toast.ERROR);
        });
    },
    switchViewPassword() {
      this.show = !this.show;
    },
    focusInput() {
      this.$refs.mnemonicPasswordInput.focus();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'MnemonicPasswordModal-desktop.scss';
@import 'MnemonicPasswordModal-tablet.scss';
@import 'MnemonicPasswordModal-mobile.scss';
</style>
