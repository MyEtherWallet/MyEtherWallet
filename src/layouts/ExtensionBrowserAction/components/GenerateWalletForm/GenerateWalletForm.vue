<template>
  <div>
    <form @submit.prevent>
      <div class="input-container">
        <label for="walletName"> {{ $t('mewcx.wallet-name') }} </label>
        <input
          v-model="locWalletName"
          :placeholder="$t('mewcx.add-wallet-nickname')"
          name="walletName"
        />
      </div>
      <div class="input-container">
        <label for="walletPassword"> {{ $t('mewcx.wallet-password') }} </label>
        <div class="password-input">
          <input
            v-model="locPassword"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('mewcx.password')"
            name="walletPassword"
          />
          <img
            :src="showPassword ? showIcon : hide"
            @click.prevent="showPassword = !showPassword"
          />
        </div>
      </div>
      <div class="input-container">
        <div class="password-input">
          <input
            v-model="locConfirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('mewcx.confirm-password')"
          />
          <img
            :src="showConfirmPassword ? showIcon : hide"
            @click.prevent="showConfirmPassword = !showConfirmPassword"
          />
        </div>
      </div>
      <button
        :class="[
          generateWalletValidation ? '' : 'disabled',
          loading ? 'disabled' : '',
          'submit-button large-round-button-green-filled'
        ]"
        type="submit"
        @click.prevent="generateWallet"
      >
        <span v-show="!loading"> {{ $t('mewcx.add') }} </span>
        <i v-show="loading" class="fa fa-spinner fa-spin" />
      </button>
      <p v-if="error !== ''">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';

export default {
  props: {
    generateWallet: {
      type: Function,
      default: () => {}
    },
    generateWalletValidation: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    walletName: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    confirmPassword: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showPassword: false,
      showConfirmPassword: false,
      hide: hide,
      showIcon: showIcon,
      locWalletName: this.walletName,
      locPassword: this.password,
      locConfirmPassword: this.confirmPassword
    };
  },
  watch: {
    locWalletName(newVal) {
      this.$emit('walletName', newVal);
    },
    locPassword(newVal) {
      this.$emit('password', newVal);
    },
    locConfirmPassword(newVal) {
      this.$emit('confirmPassword', newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'GenerateWalletForm.scss';
</style>
