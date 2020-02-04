<template>
  <div>
    <mewcx-modal-wrapper ref="addMyWallet">
      <template v-if="step !== 0" v-slot:modalTopButton>
        <div class="back-button" @click="back">
          <img src="@/assets/images/icons/back.svg" />
          <span>Back</span>
        </div>
      </template>
      <template v-slot:modalContentTitle>
        {{ titles[step].title }}
      </template>
      <template v-if="titles[step].subtext" v-slot:modalContentSubtext>
        {{ titles[step].subtext }}
      </template>
      <div class="modal-contents">
        <access-wallet-button
          v-if="step === 0"
          :generate="stepChange"
          :import="stepChange"
        />
        <div v-if="step === 1">
          <form @submit.prevent>
            <div class="input-container">
              <label for="walletName"> {{ $t('mewcx.wallet-name') }} </label>
              <input
                v-model="walletName"
                :placeholder="$t('mewcx.add-wallet-nickname')"
                name="walletName"
              />
            </div>
            <div class="input-container">
              <label for="walletPassword"> Wallet Password </label>
              <div class="password-input">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
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
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm password"
                />
                <img
                  :src="showConfirmPassword ? showIcon : hide"
                  @click.prevent="showConfirmPassword = !showConfirmPassword"
                />
              </div>
            </div>
            <button
              :class="[
                validInputs ? '' : 'disabled',
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
      </div>
    </mewcx-modal-wrapper>
  </div>
</template>

<script>
import MewcxModalWrapper from '../../wrappers/MewcxModalWrapper';
import AccessWalletButton from '../AccessWalletButton';
import hide from '@/assets/images/icons/hide-password.svg';
import showIcon from '@/assets/images/icons/show-password.svg';
import { Toast, ExtensionHelpers } from '@/helpers';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';

const TITLES = {
  0: {
    title: 'Add My Wallet',
    subtext: 'How would you like to add a new wallet?'
  },
  1: {
    title: 'Generate a New Wallet',
    subtext: false
  }
};
export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper,
    'access-wallet-button': AccessWalletButton
  },
  data() {
    return {
      step: 0,
      titles: TITLES,
      lastStep: 0,
      walletName: '',
      password: '',
      confirmPassword: '',
      hide: hide,
      showIcon: showIcon,
      showPassword: false,
      showConfirmPassword: false,
      loading: false
    };
  },
  computed: {
    validMatchingPassword() {
      return this.password === this.confirmPassword;
    },
    validInputs() {
      return (
        this.walletName !== '' &&
        this.validMatchingPassword &&
        this.password !== '' &&
        this.confirmPassword !== '' &&
        this.password.length > 7 &&
        this.confirmPassword.length > 7
      );
    },
    error() {
      if (!this.validMatchingPassword) {
        return "Password doesn't match!";
      }

      return '';
    }
  },
  watch: {
    step(newVal, oldVal) {
      this.lastStep = oldVal;
    }
  },
  mounted() {
    this.$refs.addMyWallet.$refs.modalWrapper.$on('hidden', () => {
      this.step = 0;
      this.lastStep = 0;
    });
  },
  methods: {
    stepChange(num) {
      this.step = num;
    },
    back() {
      this.step = this.lastStep;
    },
    generateWallet() {
      this.loading = true;
      this.generateOnly = true;
      const _self = this;
      const worker = new walletWorker();
      worker.postMessage({ type: 'createWallet', data: [this.password] });
      worker.onmessage = e => {
        this.file = e.data.walletJson;
        ExtensionHelpers.addWalletToStore(
          `0x${e.data.walletJson.address}`,
          JSON.stringify(e.data.walletJson),
          this.walletName,
          'wallet',
          'add',
          _self.storeWalletCb
        );
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
        this.loading = false;
      };
    },
    storeWalletCb() {
      this.loading = false;
      this.$eventHub.$emit(
        'showSuccessModal',
        'Successfully added a wallet!',
        null
      );
      this.$refs.addMyWallet.$refs.modalWrapper.hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'AddWalletModal.scss';
</style>
