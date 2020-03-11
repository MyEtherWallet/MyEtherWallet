<template>
  <div>
    <mewcx-modal-wrapper ref="addMyWallet">
      <template v-if="step !== 0" v-slot:modalTopButton>
        <div class="back-button" @click="back">
          <img src="@/assets/images/icons/back.svg" />
          <span>{{ $t('mewcx.back') }}</span>
        </div>
      </template>
      <template v-if="step >= 2" v-slot:modalMiddleButton>
        <add-wallet-step-header :step="step" />
      </template>
      <template v-slot:modalContentTitle>
        {{ $t(titles[step].title) }}
      </template>
      <template v-if="$t(titles[step].subtext)" v-slot:modalContentSubtext>
        <i18n :path="titles[step].subtext" tag="p">
          <template v-slot:additionalSubtext>
            <span v-if="selected === 'byPriv'">{{ $t('mewcx.for-priv') }}</span>
            <span v-if="selected === 'byJson'">{{
              $t('mewcx.for-keystore')
            }}</span>
            <span v-if="selected === 'byMnem'">{{
              $t('mewcx.for-mnemonic')
            }}</span>
          </template>
        </i18n>
      </template>
      <div class="modal-contents">
        <access-wallet-button
          v-if="step === 0"
          :generate="stepChange"
          :import="stepChange"
        />
        <generate-wallet-form
          v-if="step === 1"
          :error="error"
          :loading="loading"
          :generate-wallet="generateWallet"
          :generate-wallet-validation="generateWalletValidation"
          @walletName="updateWalletName"
          @password="updatePassword"
          @confirmPassword="updateConfirmPassword"
        />
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
            <label for="walletPassword"> {{ $t('mewcx.password') }} </label>
            <div class="password-input">
              <input
                v-model="password"
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
          <div v-if="selected === 'byPriv'" class="input-container">
            <label for="walletPassword">{{ $t('mewcx.private-key') }} </label>
            <textarea v-model="privKey" />
          </div>
          <div v-if="selected === 'byMnem'" class="mnemonic-inputs-container">
            <div v-show="mnemonicStep === 'enterPhrase'">
              <div class="mnemonic-inputs-header">
                <h3>
                  {{ $t('mewcx.enter-mnemonic-phrase') }}
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
              <div class="mnemonic-extra-word-container">
                <div class="title-button-container">
                  <div class="title-popover">
                    <h3>{{ $t('mewcx.extra-word') }}</h3>
                    <img
                      v-b-popover.hover.top="'I am popover directive content!'"
                      src="@/assets/images/icons/exclamation-grey.svg"
                    />
                  </div>
                  <div>
                    <div class="switch sliding-switch-white">
                      <label class="switch">
                        <input
                          type="checkbox"
                          @click="
                            () => {
                              showExtraWord = !showExtraWord;
                            }
                          "
                        />
                        <span class="slider round" />
                      </label>
                    </div>
                  </div>
                </div>
                <b-collapse v-model="showExtraWord">
                  <div class="input-container">
                    <div class="password-input">
                      <input
                        v-model="extraWord"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Extra word"
                        name="mnemonicExtraWord"
                      />
                      <img
                        :src="showPassword ? showIcon : hide"
                        @click.prevent="showPassword = !showPassword"
                      />
                    </div>
                  </div>
                </b-collapse>
              </div>
            </div>
            <div v-show="mnemonicStep === 'chooseAddress'">
              <div class="mnemonic-path-dropdown">
                <h3>
                  {{ $t('mewcx.choose-hd-path') }}
                </h3>
                <b-dropdown
                  ref="mnemonicPathDropdown"
                  no-flip
                  no-caret
                  toggle-class="mnemonic-path-dropdown-button"
                  menu-class="mnemonic-path-dropdown-menu"
                >
                  <template v-slot:button-content>
                    <div class="mnemonic-dropdown-title">
                      <p>{{ selectedPath }}</p>
                      <i
                        :class="[
                          showPaths ? 'fa-angle-up' : 'fa-angle-down',
                          'fa fa-lg'
                        ]"
                      />
                    </div>
                  </template>
                  <b-dropdown-item
                    v-for="(path, idx) in supportedPaths"
                    :key="path.label + idx"
                    @click="updatePath(path.path)"
                  >
                    {{ path.path }} - {{ path.label }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <div class="mnemonic-address-container">
                <h3>
                  {{ $t('mewcx.addresses') }}
                </h3>
                <div>
                  <div
                    v-for="item in accounts"
                    :key="item.index"
                    :class="[
                      selectedAddress ===
                      item.account.getChecksumAddressString()
                        ? 'selected'
                        : '',
                      'address-item'
                    ]"
                    @click="selectAddress(item)"
                  >
                    <div class="blockie-container">
                      <blockie
                        :address="item.account.getChecksumAddressString()"
                        width="35px"
                        height="35px"
                      />
                    </div>
                    <p>{{ item.account.getChecksumAddressString() }}</p>
                  </div>
                </div>
              </div>
              <div
                v-show="selectedAddress === ''"
                class="load-more-container"
                @click="updatePath(selectedPath)"
              >
                {{ $t('mewcx.load-more') }}
              </div>
            </div>
          </div>
        </div>
        <verify-wallet-info-form
          v-if="step === 4"
          :error="error"
          :loading="loading"
          :generate-wallet="generateWallet"
          :generate-wallet-validation="generateWalletValidation"
          :network="network"
          :wallet="wallet"
          :converted-balance="convertedBalance"
          :balance="balance"
          @walletName="updateWalletName"
          @password="updatePassword"
          @confirmPassword="updateConfirmPassword"
        />
        <div v-if="step >= 2" class="add-wallet-button-container">
          <standard-button
            :button-disabled="!importWalletValidation"
            :options="{
              title: step < 4 ? $t('common.continue') : $t('mewcx.add'),
              buttonStyle: 'green',
              noMinWidth: true,
              fullWidth: true,
              spinner: loading
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
import AddWalletStepHeader from '../AddWalletStepHeader';
import GenerateWalletForm from '../GenerateWalletForm';
import VerifyWalletInfoForm from '../VerifyWalletInfoForm';
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
import { MnemonicWallet } from '@/wallets';

const TITLES = {
  0: {
    title: 'mewcx.import-wallet.add-wallet-section.title',
    subtext: 'mewcx.import-wallet.add-wallet-section.subtext'
  },
  1: {
    title: 'mewcx.import-wallet.generate-wallet.title',
    subtext: false
  },
  2: {
    title: 'mewcx.import-wallet.step-1.title',
    subtext: 'mewcx.import-wallet.step-1.subtext'
  },
  3: {
    title: 'mewcx.import-wallet.step-2.title',
    subtext: 'mewcx.import-wallet.step-2.subtext'
  },
  4: {
    title: 'mewcx.import-wallet.step-3.title',
    subtext: 'mewcx.import-wallet.step-3.subtext'
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
    blockie: Blockie,
    'add-wallet-step-header': AddWalletStepHeader,
    'generate-wallet-form': GenerateWalletForm,
    'verify-wallet-info-form': VerifyWalletInfoForm
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
      oldStepValue: 0,
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
      balance: '0',
      privKey: '',
      mnemonicValue: 12,
      mnemonicPhraseHolder: {},
      mnemonicPhrase: '',
      showExtraWord: false,
      extraWord: '',
      mnemonicStep: 'enterPhrase',
      selectedAddress: '',
      selectedAddressPath: '',
      selectedPath: '',
      supportedPaths: [],
      showPaths: false,
      accounts: [],
      currentIndex: 0
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
          case 'byMnem':
            if (this.mnemonicStep === 'enterPhrase') {
              const validLength =
                Object.keys(this.mnemonicPhraseHolder).length ===
                this.mnemonicValue;
              const hasEmpty = Object.values(this.mnemonicPhraseHolder).find(
                item => {
                  return item === '';
                }
              );

              return validLength && hasEmpty === undefined;
            } else if (this.mnemonicStep === 'chooseAddress') {
              return this.selectedAddress !== '';
            }
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
    },
    mnemonicStep(newVal) {
      if (newVal === 'chooseAddres') {
        this.$refs.mnemonicPathDropdown.$on('show', () => {
          this.showPaths = true;
        });
        this.$refs.mnemonicPathDropdown.$on('hide', () => {
          this.showPaths = false;
        });
      }
    },
    step(newVal, oldVal) {
      this.oldStepValue = oldVal;
      this.loading = false;
      if (oldVal > newVal) {
        switch (oldVal) {
          case 1:
            this.generateWalletReset();
            break;
          case 2:
            // import wallet reset
            this.selected = '';
            break;
          case 3:
            this.importWalletMethodReset();
            break;
          case 4:
            this.saveWalletReset();
        }
      }
    },
    wallet(newValue) {
      if (Object.keys(newValue).length > 0) {
        this.getBalance();
      }
    }
  },
  mounted() {
    this.$refs.addMyWallet.$refs.modalWrapper.$on('hidden', () => {
      this.step = 0;
      this.walletName = '';
      this.password = '';
      this.confirmPassword = '';
      this.hide = hide;
      this.showIcon = showIcon;
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.loading = false;
      this.selected = '';
      this.file = '';
      this.wallet = {};
      this.balance = '0';
      this.privKey = '';
      this.mnemonicValue = 12;
      this.mnemonicPhraseHolder = {};
      this.mnemonicPhrase = '';
      this.showExtraWord = false;
      this.extraWord = '';
      this.mnemonicStep = 'enterPhrase';
      this.selectedAddress = '';
      this.selectedAddressPath = '';
      this.selectedPath = '';
      this.supportedPaths = [];
      this.showPaths = false;
      this.accounts = [];
      this.currentIndex = 0;
    });
  },
  methods: {
    updateWalletName(e) {
      this.walletName = e;
    },
    updatePassword(e) {
      this.password = e;
    },
    updateConfirmPassword(e) {
      this.confirmPassword = e;
    },
    generateWalletReset() {
      this.walletName = '';
      this.password = '';
      this.confirmPassword = '';
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.loading = false;
      this.file = '';
      this.wallet = {};
      this.balance = '0';
    },
    importWalletMethodReset() {
      const BY_JSON = 'byJson';
      const BY_MNEM = 'byMnem';
      const BY_PRIV = 'byPriv';
      switch (this.selected) {
        case BY_JSON:
          this.file = '';
          this.password = '';
          break;
        case BY_MNEM:
          this.mnemonicValue = 12;
          this.mnemonicPhraseHolder = {};
          this.mnemonicPhrase = '';
          this.showExtraWord = false;
          this.extraWord = '';
          this.mnemonicStep = 'enterPhrase';
          this.selectedAddress = '';
          this.selectedAddressPath = '';
          this.selectedPath = '';
          this.supportedPaths = [];
          this.showPaths = false;
          this.accounts = [];
          this.currentIndex = 0;
          break;
        case BY_PRIV:
          this.privKey = '';
      }
    },
    saveWalletReset() {
      this.walletName = '';
      this.balance = '0';
      this.password = '';
      this.confirmPassword = '';
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.importWalletMethodReset();
    },
    selectAddress(item) {
      this.selectedAddress =
        this.selectedAddress === item.account.getChecksumAddressString()
          ? ''
          : item.account.getChecksumAddressString();
      this.selectedAddressPath =
        this.selectedAddressPath === `${this.selectedPath}/${item.index}`
          ? ''
          : `${this.selectedPath}/${item.index}`;
    },
    updatePath(path) {
      if (this.selectedPath !== path) {
        this.currentIndex = 0;
        this.accounts = [];
      } else {
        this.currentIndex = 0;
        this.accounts = [];
      }
      this.selectedPath = path;
      this.wallet.init(path).then(() => {
        for (let i = this.currentIndex; i < this.currentIndex + 5; i++) {
          this.setAccount(i);
        }
        this.currentIndex += 5;
      });
    },
    async setAccount(idx) {
      const account = await this.wallet.getAccount(idx);
      this.accounts.push({
        index: idx,
        account: account
      });
    },
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
      this.balance = this.web3.utils.fromWei(balance);
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
    storeWallet() {
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
            if (this.mnemonicStep !== 'chooseAddress') {
              this.getWalletFromMnemonic();
            } else {
              this.setAddressFromMnemonic();
            }
            break;
          case BY_PRIV:
            this.generateWalletViaPriv();
            break;
          default:
            break;
        }
      } else if (this.step === 4) {
        this.storeWallet();
      }
    },
    async setAddressFromMnemonic() {
      this.loading = true;
      const privateKey = await ExtensionHelpers.getPrivFromMnemonicWallet(
        this.wallet.mnemonic,
        this.selectedAddressPath
      );

      this.loading = false;
      this.wallet = new WalletInterface(
        privateKey.toString('hex'),
        false,
        privKeyType
      );
      this.step += 1;
    },
    getWalletFromMnemonic() {
      this.loading = true;
      try {
        MnemonicWallet(
          Object.values(this.mnemonicPhraseHolder).join(' '),
          this.extraWord
        )
          .then(wallet => {
            this.extraWord = '';
            this.loading = false;
            this.wallet = wallet;
            this.mnemonicPhraseHolder = {};
            this.mnemonicStep = 'chooseAddress';
            this.selectedPath = wallet.basePath;
            this.supportedPaths = wallet.supportedPaths;
            this.updatePath(wallet.basePath);
          })
          .catch(e => {
            this.extraWord = '';
            this.loading = false;
            Toast.responseHandler(e, Toast.ERROR);
          });
      } catch (e) {
        Toast.responseHandler(e, Toast.ERROR);
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

<style lang="scss">
@import '~@/scss/GlobalVariables';

.mnemonic-path-dropdown-button {
  width: 100%;
  background-color: $white !important;
  padding: 20px 35px;
  border: none;

  &:hover {
    background-color: $mew-green !important;
    color: $white !important;
  }

  .mnemonic-dropdown-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p,
    i {
      color: $dark-blue-2;
    }
  }
}

.mnemonic-path-dropdown-menu {
  max-height: 300px;
  overflow: auto;
  width: 100%;
}

.mnemonic-path-dropdown {
  h3 {
    color: $dark-blue-2;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .dropdown {
    width: 100%;

    .show {
      color: $white;
    }
  }
}
</style>

<style lang="scss" scoped>
@import 'AddWalletModal.scss';
</style>
