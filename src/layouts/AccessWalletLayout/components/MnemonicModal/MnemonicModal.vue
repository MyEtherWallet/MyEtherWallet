<template>
  <b-modal
    ref="mnemonicPhrase"
    :title="$t('accessWallet.mnemonic.modal.title')"
    hide-footer
    class="bootstrap-modal modal-metamask nopadding"
    centered
    static
    lazy
    @shown="focusInput"
    @hide="clearInputs"
  >
    <div class="warning">
      <warning-message />
    </div>
    <div class="contents">
      <p class="instruction">
        {{ $t('accessWallet.mnemonic.modal.text') }}
      </p>
      <div class="tools">
        <div class="value-switch noselect">
          <div class="sliding-switch">
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round" @click="mnemonicValueBitSizeChange" />
            </label>
            <div class="labels">
              <span :class="[!mnemonic24 ? 'white' : '', 'label-left']"
                >12</span
              >
              <span :class="[mnemonic24 ? 'white' : '', 'label-right']"
                >24</span
              >
            </div>
          </div>
          <span class="text__base link switch-label">{{
            $t('common.value')
          }}</span>
        </div>
      </div>
      <form>
        <div class="phrases">
          <ul>
            <li v-for="index in mnemonicSize" :key="index">
              <span>{{ index }}.</span>
              <input
                v-model="mnemonicPhrase[index - 1]"
                :ref="`mnemonicInput${index - 1}`"
                type="text"
                name=""
              />
            </li>
          </ul>
        </div>
        <div class="option-container-block">
          <expending-option
            :title="$t('common.password.string')"
            :button-text="$t('common.optional')"
            @expanded="passwordInputViewChange"
          >
            <div class="option-container">
              <create-wallet-input
                v-model="password"
                :show-button="false"
                :full-width="true"
              />
            </div>
          </expending-option>
        </div>
        <p v-show="error !== ''" class="error">{{ error }}</p>
        <div class="button-container-block">
          <standard-button
            :options="continueButtonOptions"
            :spinner="spinner"
            @click.native="unlockWallet"
          />
        </div>
      </form>
      <customer-support />
    </div>
  </b-modal>
</template>

<script>
import CustomerSupport from '@/components/CustomerSupport';
import WarningMessage from '@/components/WarningMessage';
import StandardButton from '@/components/Buttons/StandardButton';
import CreateWalletInput from './components/CreateWalletInput';
import ExpendingOption from '@/components/ExpendingOption';
import { MnemonicWallet } from '@/wallets';
import { Toast } from '@/helpers';

export default {
  components: {
    'customer-support': CustomerSupport,
    'warning-message': WarningMessage,
    'standard-button': StandardButton,
    'create-wallet-input': CreateWalletInput,
    'expending-option': ExpendingOption
  },
  props: {
    hardwareWalletOpen: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      spinner: false,
      error: '',
      continueButtonOptions: {
        title: this.$t('common.continue'),
        buttonStyle: 'green',
        noMinWidth: true,
        fullWidth: true
      },
      mnemonicPhrase: new Array(this.mnemonicSize).fill(''),
      mnemonic24: false,
      mnemonicSize: 12,
      password: ''
    };
  },
  watch: {
    mnemonicPhrase(newVal) {
      if (newVal[0] !== ' ' && newVal[0].indexOf(' ') >= 0) {
        if (
          newVal[0].split(' ').length === 12 ||
          newVal[0].split(' ').length === 24
        ) {
          this.mnemonic24 = newVal[0].split(' ').length === 24;
          this.mnemonicSize = newVal[0].split(' ').length;
          this.mnemonicPhrase = newVal[0].split(' ');
        }
      }
    }
  },
  methods: {
    passwordInputViewChange() {
      this.password = '';
    },
    unlockWallet(e) {
      e.preventDefault();
      e.stopPropagation();
      this.spinner = true;
      MnemonicWallet(this.mnemonicPhrase.join(' '), this.password)
        .then(wallet => {
          this.password = '';
          this.spinner = false;
          this.$refs.mnemonicPhrase.hide();
          this.hardwareWalletOpen(wallet);
        })
        .catch(e => {
          this.password = '';
          this.spinner = false;
          this.error = e;
          Toast.responseHandler(e, Toast.ERROR);
        });
    },
    clearInputs() {
      this.mnemonicPhrase = new Array(this.mnemonicSize).fill('');
    },
    mnemonicValueBitSizeChange() {
      this.mnemonic24 = !this.mnemonic24;
      this.mnemonic24 ? (this.mnemonicSize = 24) : (this.mnemonicSize = 12);
      this.mnemonicPhrase = new Array(this.mnemonicSize).fill('');
    },
    openPasswordModal() {
      this.mnemonicPhrasePasswordModalOpen(this.mnemonicPhrase.join(' '));
    },
    focusInput() {
      this.$refs.mnemonicInput0[0].focus();
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'MnemonicModal-desktop.scss';
@import 'MnemonicModal-tablet.scss';
@import 'MnemonicModal-mobile.scss';
</style>
