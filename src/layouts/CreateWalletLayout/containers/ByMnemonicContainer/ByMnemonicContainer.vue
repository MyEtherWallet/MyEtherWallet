<template>
  <div class="create-wallet-by-mnemonic">
    <finish-modal ref="finish" :unlock="unlockWallet" />
    <print-modal
      ref="print"
      :mnemonic="mnemonicValues"
      :is-twenty-four="mnemonic24"
    />
    <verification-modal
      ref="verification"
      :mnemonic-values="mnemonicValues"
      :password="password"
      @verifiedMnemonic="openFinish"
    />
    <div class="wrap">
      <div class="contents">
        <div class="tools">
          <div class="value-switch noselect">
            <div class="sliding-switch">
              <label class="switch">
                <input type="checkbox" />
                <span
                  class="slider round"
                  @click="mnemonicValueBitSizeChange"
                />
              </label>
              <div class="labels">
                <span class="label-left white">12</span>
                <span class="label-right">24</span>
              </div>
            </div>
            <span class="text__base link switch-label">{{
              $t('createWallet.mnemonic.value')
            }}</span>
          </div>

          <div
            class="random-button color-green noselect"
            @click="mnemonicValueRefresh"
          >
            <i class="fa fa-refresh" aria-hidden="true" />
            <span>{{ $t('createWallet.mnemonic.random') }}</span>
          </div>
        </div>
        <div class="phrases">
          <ul>
            <li v-for="(value, index) in mnemonicValues" :key="index">
              {{ index + 1 }}.
              <span>{{ value }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="option-container-block">
        <expanding-option
          :title="$t('createWallet.mnemonic.extra-word')"
          :popover="$t('createWallet.mnemonic.extra-word-popover')"
          :button-text="$t('common.optional')"
          @expanded="passwordInputViewChange"
        >
          <div class="option-container">
            <create-wallet-input
              v-model="password"
              :show-button="false"
              :full-width="true"
            />
            <div class="password-warning">
              <p>{{ $t('createWallet.mnemonic.warning.extra-word') }}</p>
              <div class="read">
                > {{ $t('common.read') }}:
                <a
                  href="https://kb.myetherwallet.com/en/security-and-privacy/mnemonic-phrase-extra-word/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ $t('common.article.mnemonic-password') }}</a
                >
              </div>
            </div>
          </div>
        </expanding-option>
      </div>

      <div class="user-input">
        <div
          class="next-button large-round-button-green-filled clickable"
          @click="mnemonicVerificationModalOpen"
        >
          {{ $t('createWallet.mnemonic.button-wrote-it-down') }}
        </div>
        <div @click="openPrintModal">
          <img alt class="icon" src="~@/assets/images/icons/printer.svg" />
        </div>
      </div>
      <div class="footer-text">
        <i18n tag="p" path="createWallet.mnemonic.do-not-forget-save-mnemonic">
          <span slot="do-not-forget">
            {{ $t('createWallet.password.do-not-forget') }}
          </span>
        </i18n>
      </div>
    </div>
  </div>
</template>

<script>
import FinishModal from './components/FinishModal';
import PrintModal from './components/PrintModal';
import VerificationModal from './components/VerificationModal';
import ExpandingOption from '@/components/ExpandingOption';
import CreateWalletInput from '../../components/CreateWalletInput';

const bip39 = require('bip39');

export default {
  components: {
    'finish-modal': FinishModal,
    'verification-modal': VerificationModal,
    'print-modal': PrintModal,
    'expanding-option': ExpandingOption,
    'create-wallet-input': CreateWalletInput
  },
  data() {
    return {
      password: '',
      verificationValues: [],
      mnemonicValues: [],
      mnemonic24: false,
      passwordInput: {
        title: ''
      }
    };
  },
  mounted() {
    // Generate a random mnemonic
    this.mnemonicValues = bip39.generateMnemonic(128).split(' ');
  },
  methods: {
    passwordInputViewChange() {
      this.password = '';
    },
    unlockWallet() {
      this.$router.push('/access-my-wallet');
    },
    mnemonicValueRefresh() {
      if (this.mnemonic24 === true) {
        this.mnemonicValues = bip39.generateMnemonic(256).split(' ');
      } else {
        this.mnemonicValues = bip39.generateMnemonic(128).split(' ');
      }
    },
    mnemonicValueBitSizeChange() {
      const left = document.querySelector('.label-left');
      const right = document.querySelector('.label-right');

      this.mnemonic24 = !this.mnemonic24;

      if (this.mnemonic24 === true) {
        // Regenerate new 24 Mnemonic phrases
        this.mnemonicValues = bip39.generateMnemonic(256).split(' ');
        left.classList.remove('white');
        right.classList.add('white');
      } else {
        // Regenerate new 12 Mnemonic phrases
        this.mnemonicValues = bip39.generateMnemonic(128).split(' ');
        left.classList.add('white');
        right.classList.remove('white');
      }
    },
    openFinish() {
      this.$refs.verification.$refs.verification.hide();
      this.$refs.finish.$refs.done.show();
    },
    mnemonicVerificationModalOpen() {
      this.$refs.verification.$refs.verification.show();
    },
    openPrintModal() {
      this.$refs.print.$refs.print.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ByMnemonicContainer.scss';
</style>
