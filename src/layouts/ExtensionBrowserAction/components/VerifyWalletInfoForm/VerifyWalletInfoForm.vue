<template>
  <div class="verify-wallet-container">
    <div class="wallet-verification-container">
      <div>
        <blockie width="35px" height="35px" :address="address" />
      </div>
      <div class="wallet-information">
        <p>
          {{ address }}
        </p>
        <div class="balance-container">
          <p class="total-text">{{ $t('mewcx.total-wallet-value') }}</p>
          <p>
            <span class="total-balance">{{ convertedBalance }}</span>
            <br />
            <span class="eth-balance">
              {{ balance.length > 7 ? balance.substr(0, 7) + '...' : balance }}
              {{ network.type.currencyName }}
            </span>
          </p>
        </div>
      </div>
    </div>
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
        <label for="walletPassword">
          {{ $t('mewcx.create-wallet-password') }}
        </label>
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
      <p v-if="error !== ''">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
import Blockie from '@/components/Blockie';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    address: {
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
    },
    convertedBalance: {
      type: String,
      default: '$ '
    },
    balance: {
      type: String,
      default: '0'
    },
    network: {
      type: Object,
      default: () => {}
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
@import 'VerifyWalletInfoForm.scss';
</style>
