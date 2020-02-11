<template>
  <div>
    <mewcx-modal-wrapper ref="addMyWallet">
      <template v-if="step !== 0" v-slot:modalTopButton>
        <div class="back-button" @click="back">
          <img src="@/assets/images/icons/back.svg" />
          <span>Back</span>
        </div>
      </template>
      <template v-if="step >= 2" v-slot:modalMiddleButton>
        <div class="steps-container">
          <div
            :class="[
              step === 2 ? 'active' : '',
              step > 2 ? 'passed' : '',
              'step-item one'
            ]"
          >
            <div class="step-one" />
            <p>STEP 1. Choose a method</p>
          </div>
          <div
            :class="[
              step === 3 ? 'active' : '',
              step > 3 ? 'passed' : '',
              'step-item two'
            ]"
          >
            <div class="step-two" />
            <p>STEP 2. Unlock my wallet</p>
          </div>
          <div
            :class="[
              step === 4 ? 'active' : '',
              step > 4 ? 'passed' : '',
              'step-item three'
            ]"
          >
            <div class="step-three" />
            <p>STEP 3. Confirm to add</p>
          </div>
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
        <div v-if="step === 2" class="import-method-container">
          <wallet-option
            v-for="(item, idx) in items"
            :key="item.name + idx"
            :selected="selected === item.name"
            :hover-icon="item.imgHoverPath"
            :text="$t(item.text)"
            :name="item.name"
            @updateSelected="updateSelected"
          />
          <input
            ref="jsonInput"
            type="file"
            name="file"
            style="display: none"
            @change="uploadFile"
          />
        </div>
        <div v-if="step === 3" class="unlock-wallet-container">
          <div v-if="selected === 'byJson'" class="input-container">
            <label for="walletPassword"> Password </label>
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
          <div v-if="selected === 'byPriv'" class="input-container">
            <label for="walletPassword"> Private Key </label>
            <textarea v-model="privKey" />
          </div>
          <div v-if="selected === 'byMnem'" class="mnemonic-inputs-container">
            <div class="mnemonic-inputs-header">
              <h3>
                Enter Mnemonic Phrase
              </h3>
              <div class="mnemonic-count-container">
                <p>Value</p>
                <div
                  :class="[
                    mnemonicValue === 12 ? 'active' : '',
                    'mnemonic-count left'
                  ]"
                  @click="updateMnemonicValue(12)"
                >
                  12
                </div>
                <div
                  :class="[
                    mnemonicValue === 24 ? 'active' : '',
                    'mnemonic-count right'
                  ]"
                  @click="updateMnemonicValue(24)"
                >
                  24
                </div>
              </div>
            </div>
            <div class="mnemonic-inputs">
              <div
                v-for="(_, idx) in mnemonicInputGenerator"
                :key="'a' + idx"
                class="actual-inputs"
              >
                <label :for="'menmonicInput' + idx">{{ idx + 1 }}.</label>
                <input
                  v-model="mnemonicPhraseHolder[idx]"
                  placeholder=""
                  :name="'menmonicInput' + idx"
                />
              </div>
            </div>

            <expanding-option
              :title="$t('createWallet.mnemonic.do-you-extra-word')"
              :popover="
                $t('createWallet.mnemonic.access-wallet-extra-word-popover')
              "
              :button-text="$t('common.no')"
              :show-enable="true"
              @expanded="passwordInputViewChange"
            >
              <div class="option-container">
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
            </expanding-option>
          </div>
        </div>
        <div v-if="step === 4" class="verify-wallet-container">
          <div class="wallet-verification-container">
            <div v-if="Object.keys(wallet).length > 0">
              <blockie
                width="35px"
                height="35px"
                :address="wallet.getAddressString()"
              />
            </div>
            <div class="wallet-information">
              <p>
                {{ wallet.getAddressString() }}
              </p>
              <div class="balance-container">
                <p class="total-text">Total Wallet Value</p>
                <p>
                  <span class="total-balance">{{ convertedBalance }}</span>
                  <br />
                  <span class="eth-balance">
                    {{ balance }} {{ network.type.currencyName }}
                  </span>
                </p>
              </div>
            </div>
          </div>
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
              <label for="walletPassword"> Create Wallet Password </label>
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
            <p v-if="error !== ''">{{ error }}</p>
          </form>
        </div>
        <div v-if="step >= 2" class="add-wallet-button-container">
          <standard-button
            :button-disabled="!importWalletValidation"
            :options="{
              title: $t('common.continue'),
              buttonStyle: 'green',
              noMinWidth: true,
              fullWidth: true
            }"
            :click-function="clickFunction"
          />
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
import { Toast, ExtensionHelpers, Misc } from '@/helpers';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import WalletOption from '@/layouts/AccessWalletLayout/components/WalletOption';
import byJsonImgHov from '@/assets/images/icons/button-json-hover.svg';
import byMnemImgHov from '@/assets/images/icons/button-mnemonic-hover.svg';
import privKeyImgHov from '@/assets/images/icons/button-key-hover.svg';
import { WalletInterface } from '@/wallets';
import {
  KEYSTORE as keyStoreType,
  PRIV_KEY as privKeyType
} from '@/wallets/bip44/walletTypes';
import Blockie from '@/components/Blockie';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';

const TITLES = {
  0: {
    title: 'Add My Wallet',
    subtext: 'How would you like to add a new wallet?'
  },
  1: {
    title: 'Generate a New Wallet',
    subtext: false
  },
  2: {
    title: 'Step 1. Choose a method',
    subtext: 'Please choose a method to import your existing wallet'
  },
  3: {
    title: 'Step 2. Unlock My Wallet',
    subtext: 'Please enter the <specific to wallet>'
  },
  4: {
    title: 'Step 3. Confirm to Add',
    subtext: 'Please name your wallet, and create a password for it.'
  }
};

const ACCESS_TITLES = [
  {
    name: 'byJson',
    imgHoverPath: byJsonImgHov,
    text: 'accessWallet.json-file'
  },
  {
    name: 'byMnem',
    imgHoverPath: byMnemImgHov,
    text: 'accessWallet.mnemonic.string'
  },
  {
    name: 'byPriv',
    imgHoverPath: privKeyImgHov,
    text: 'accessWallet.private-key.string'
  }
];
export default {
  components: {
    'mewcx-modal-wrapper': MewcxModalWrapper,
    'access-wallet-button': AccessWalletButton,
    'wallet-option': WalletOption,
    blockie: Blockie
  },
  props: {
    usd: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      step: 0,
      titles: TITLES,
      walletName: '',
      password: '',
      confirmPassword: '',
      hide: hide,
      showIcon: showIcon,
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      items: ACCESS_TITLES,
      selected: '',
      file: '',
      wallet: {},
      balance: 0,
      privKey: '',
      mnemonicValue: 12,
      mnemonicPhraseHolder: {},
      mnemonicPhrase: ''
    };
  },
  computed: {
    ...mapState('main', ['network', 'web3']),
    mnemonicInputGenerator() {
      return new Array(this.mnemonicValue);
    },
    convertedBalance() {
      const balance = new BigNumber(this.balance).times(this.usd).toNumber();
      return Misc.toDollar(balance);
    },
    validMatchingPassword() {
      return this.password === this.confirmPassword;
    },
    generateWalletValidation() {
      return (
        this.walletName !== '' &&
        this.validMatchingPassword &&
        this.password !== '' &&
        this.confirmPassword !== '' &&
        this.password.length > 7 &&
        this.confirmPassword.length > 7
      );
    },
    importWalletValidation() {
      if (this.step === 2) {
        return this.selected !== '';
      } else if (this.step === 3) {
        switch (this.selected) {
          case 'byJson':
            return this.password !== '';
          case 'byPriv':
            return this.privKey !== '';
        }
      }
      return this.generateWalletValidation;
    },
    error() {
      if (!this.validMatchingPassword) {
        return "Password doesn't match!";
      }

      return '';
    }
  },
  watch: {
    mnemonicPhraseHolder: {
      handler: function(newVal) {
        if (newVal[0] && newVal[0].split(' ').length > 1) {
          this.mnemonicValue = newVal[0].split(' ').length > 12 ? 24 : 12;
          newVal[0].split(' ').forEach((item, idx) => {
            this.mnemonicPhraseHolder[idx] = item;
          });
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$refs.addMyWallet.$refs.modalWrapper.$on('hidden', () => {
      this.step = 0;
      this.walletName = '';
      this.password = '';
      this.confirmPassword = '';
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.loading = false;
      this.selected = '';
      this.file = '';
      this.wallet = {};
      this.balance = 0;
      this.privKey = '';
    });
  },
  methods: {
    validateMnemonic() {},
    updateMnemonicValue(val) {
      this.mnemonicValue = val;
      this.mnemonicPhraseHolder = {};
    },
    updateSelected(e) {
      if (this.selected === e) {
        this.selected = '';
      } else {
        this.selected = e;
      }
    },
    uploadFile(evt) {
      const _self = this;
      const reader = new FileReader();
      reader.onloadend = function(event) {
        try {
          _self.file = JSON.parse(event.target.result);
          _self.step += 1;
        } catch (e) {
          Toast.responseHandler(e, Toast.ERROR);
        }
      };
      reader.readAsBinaryString(evt.target.files[0]);
    },
    unlockJson() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    stepChange(num) {
      this.step = num;
    },
    back() {
      if (this.step === 1 || this.step > 2) {
        this.step -= 1;
      } else {
        this.step -= 2;
      }
    },
    accessJson() {
      const worker = new walletWorker();
      const _self = this;
      _self.loading = true;
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = function(e) {
        const obj = {
          file: _self.file,
          name: e.data.filename
        };
        _self.wallet = new WalletInterface(
          Buffer.from(e.data._privKey),
          false,
          keyStoreType,
          '',
          JSON.stringify(obj)
        );
        _self.step += 1;
        _self.loading = false;
        _self.password = '';
        worker.terminate();
      };
      worker.onerror = function(e) {
        e.preventDefault();
        _self.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
        worker.terminate();
      };
    },
    async getBalance() {
      const balance = await this.web3.eth.getBalance(
        this.wallet.getAddressString()
      );
      this.balance = balance;
    },
    generateWalletViaPriv() {
      const parsedPrivKey =
        this.privKey.substr(0, 2) === '0x'
          ? this.privKey.replace('0x', '')
          : this.privKey;
      try {
        this.wallet = new WalletInterface(parsedPrivKey, false, privKeyType);
        this.privKey = '';
        this.step += 1;
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
      }
    },
    addKeyStore() {
      // Reuse function once state has wallet
      const _self = this;
      _self.loading = true;
      const priv = _self.wallet.getPrivateKeyString().replace('0x', '');
      const worker = new walletWorker();
      worker.postMessage({
        type: 'generateFromPrivateKey',
        data: [priv, _self.password]
      });
      worker.onmessage = e => {
        const newJson = {};
        _self.loading = false;
        Object.keys(e.data.walletJson).forEach(key => {
          newJson[key.toLowerCase()] = e.data.walletJson[key];
        });
        ExtensionHelpers.addWalletToStore(
          `0x${e.data.walletJson.address}`,
          JSON.stringify(e.data.walletJson),
          this.walletName,
          'wallet',
          'add',
          _self.storeWalletCb
        );
        worker.terminate();
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
        _self.loading = false;
        worker.terminate();
      };
    },
    clickFunction() {
      const BY_JSON = 'byJson';
      const BY_MNEM = 'byMnem';
      const BY_PRIV = 'byPriv';
      if (this.step === 2) {
        switch (this.selected) {
          case BY_JSON:
            this.unlockJson();
            break;
          case BY_MNEM:
            this.step += 1;
            break;
          case BY_PRIV:
            this.step += 1;
            break;
          default:
            break;
        }
      } else if (this.step === 3) {
        switch (this.selected) {
          case BY_JSON:
            this.accessJson();
            break;
          case BY_MNEM:
            break;
          case BY_PRIV:
            this.generateWalletViaPriv();
            break;
          default:
            break;
        }
      } else if (this.step === 4) {
        switch (this.selected) {
          case BY_JSON:
          case BY_PRIV:
            this.addKeyStore();
            break;
          case BY_MNEM:
            break;
          default:
            break;
        }
      }
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
        worker.terminate();
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
        this.loading = false;
        worker.terminate();
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
