<template>
  <div class="add-wallet-container">
    <import-mnemonic-modal
      ref="mnemonicPhrase"
      :open-address-option="openAddressOption"
      @mnemonicPhrase="updateMnemonic"
    />
    <generate-wallet-modal
      ref="generateNewWallet"
      :generate-wallet="generateWallet"
      @nickname="updateNickname"
      @password="updatePassword"
    />
    <verify-details-modal
      ref="verifyDetails"
      :wallet="wallet"
      :title="title"
      :back="back"
      :add-wallet="addWalletToStore"
      @nickname="updateNickname"
    />
    <import-private-key-modal
      ref="importPrivateKey"
      :generate-wallet="generateWalletFromPriv"
      :priv-key="privateKey"
      :loading="loading"
      @privateKey="updatePrivKey"
      @password="updatePassword"
    />
    <import-keystore-modal
      ref="importKeystore"
      :filepath="filepath"
      :loading="loading"
      :unlock-json="unlockJson"
      @filepath="updateFilePath"
      @file="updateFile"
      @password="updatePassword"
    />
    <network-address-modal
      v-if="Object.keys(wallet).length !== 0"
      ref="networkAddress"
      :generate-from-mnemonic-priv="generateFromMnemonicPriv"
      :wallet-instance="wallet"
      @accountPath="updateSelectedPath"
      @password="updatePassword"
    />
    <h2>Add My Wallet</h2>
    <p>How would you like to add your wallet?</p>
    <div class="add-wallet-options">
      <access-wallet-button
        v-for="(button, index) in options"
        :key="button.title + index"
        :func="button.func"
        :img="button.icon"
        :title="button.title"
        :recommend="button.warning"
        :disabled="false"
        :classname="'extension-selection'"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { WalletInterface, MnemonicWallet } from '@/wallets';
import {
  KEYSTORE as keyStoreType,
  PRIV_KEY as privateKeyType,
  MNEMONIC as mnemonicType
} from '@/wallets/bip44/walletTypes';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Toast, ExtensionHelpers, Wallet } from '@/helpers';

import byJsonImgHov from '@/assets/images/icons/button-json-hover.svg';
import byMnemImgHov from '@/assets/images/icons/button-mnemonic-hover.svg';
import privateKeyImgHov from '@/assets/images/icons/button-key-hover.svg';
import generateImgHov from '@/assets/images/icons/button-generate-hover.svg';
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton';
import ImportKeystoreModal from '../../components/ImportKeystoreModal';
import ImportPrivateKeyModal from '../../components/ImportPrivateKeyModal';
import VerifyDetailsModal from '../../components/VerifyDetailsModal';
import GenerateWalletModal from '../../components/GenerateWalletModal';
import ImportMnemonicModal from '../../components/ImportMnemonicModal';
import NetworkAndAddressModal from '../../components/NetworkAndAddressModal';

export default {
  components: {
    'access-wallet-button': AccessWalletButton,
    'import-keystore-modal': ImportKeystoreModal,
    'import-private-key-modal': ImportPrivateKeyModal,
    'verify-details-modal': VerifyDetailsModal,
    'import-mnemonic-modal': ImportMnemonicModal,
    'generate-wallet-modal': GenerateWalletModal,
    'network-address-modal': NetworkAndAddressModal
  },
  props: {
    openWatchOnlyModal: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      options: [
        {
          icon: generateImgHov,
          title: 'Generate a New Wallet',
          warning: '',
          func: () => {
            this.toggleGenerateWallet(true);
          }
        },
        {
          icon: byMnemImgHov,
          title: 'Mnemonic Phrase',
          warning: 'Not Recommended',
          func: () => {
            this.toggleImportMnemonicPhrase(true);
          }
        },
        {
          icon: privateKeyImgHov,
          title: `Private \n Key`,
          warning: 'Not Recommended',
          func: () => {
            this.toggleImportPrivateKey(true);
          }
        },
        {
          icon: byJsonImgHov,
          title: 'Keystore File (UTC/JSON)',
          warning: 'Not Recommended',
          func: () => {
            this.toggleImportKeystoreFile(true);
          }
        }
      ],
      filepath: '',
      file: '',
      password: '',
      wallet: {},
      loading: false,
      title: '',
      nickname: '',
      generateOnly: false,
      privateKey: '',
      mnemonicPhrase: '',
      selectedAccountPath: '',
      selectedAddress: ''
    };
  },
  computed: {
    ...mapState(['path'])
  },
  methods: {
    openAddressOption() {
      const mnemonicPhrase = this.mnemonicPhrase;
      this.loading = true;
      MnemonicWallet(mnemonicPhrase, '')
        .then(wallet => {
          this.wallet = wallet;
          this.loading = false;
          this.toggleImportMnemonicPhrase(false);
          this.toggleNetworkAddressModal(true);
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
          this.loading = false;
          this.wallet = {};
          this.toggleImportMnemonicPhrase(false);
        });
    },
    generateFromMnemonicPriv() {
      this.loading = true;
      const privateKey = ExtensionHelpers.getPrivFromMnemonicWallet(
        this.mnemonicPhrase,
        this.selectedAccountPath
      );
      this.loading = false;
      this.generateWalletFromPriv(privateKey);
    },
    generateWalletFromPriv(priv) {
      this.loading = true;
      const privKey = priv ? priv : this.privateKey;
      const worker = new walletWorker();
      worker.postMessage({
        type: 'generateFromPrivateKey',
        data: [privKey, this.password]
      });
      worker.onmessage = e => {
        const newJson = {};
        this.loading = false;
        this.file = e.data.walletJson;
        Object.keys(this.file).forEach(key => {
          newJson[key.toLowerCase()] = this.file[key];
        });
        const _wallet = Wallet.fromV3(newJson, this.password, true);
        this.wallet = new WalletInterface(
          Buffer.from(_wallet._privKey),
          false,
          priv ? mnemonicType : privateKeyType
        );
        if (priv) {
          this.toggleImportPrivateKey(this.loading);
        } else {
          this.toggleNetworkAddressModal(false);
        }
        this.toggleVerifyDetails(true, privateKeyType);
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
        this.loading = false;
      };
    },
    generateWallet() {
      this.loading = true;
      this.generateOnly = true;
      const worker = new walletWorker();
      worker.postMessage({ type: 'createWallet', data: [this.password] });
      worker.onmessage = e => {
        this.file = e.data.walletJson;
        this.unlockJson();
      };
      worker.onerror = function(e) {
        Toast.responseHandler(e, false);
        this.loading = false;
      };
    },
    storeWalletCb() {
      this.loading = false;
      Toast.responseHandler(
        `Successfully added ${this.nickname} wallet!`,
        Toast.SUCCESS
      );
      this.$router.push('/');
      this.reset();
      this.toggleVerifyDetails(false, '');
    },
    reset() {
      this.filepath = '';
      this.file = '';
      this.password = '';
      this.wallet = {};
      this.loading = false;
      this.title = '';
      this.nickname = '';
      this.generateOnly = false;
      this.privateKey = '';
      this.mnemonicPhrase = '';
      this.selectedAccountPath = '';
      this.selectedAddress = '';
    },
    addWalletToStore(type) {
      this.loading = true;
      ExtensionHelpers.addWalletToStore(
        this.wallet.getAddressString(),
        JSON.stringify(this.file),
        this.nickname,
        type,
        this.storeWalletCb
      );
    },
    back() {
      if (this.title === keyStoreType) {
        this.toggleImportKeystoreFile(true);
      } else if (this.title === privateKeyType) {
        this.toggleImportPrivateKey(true);
      } else {
        this.toggleGenerateWallet(true);
      }
      this.toggleVerifyDetails(false, '');
    },
    unlockJson() {
      this.loading = true;
      const worker = new walletWorker();
      worker.postMessage({
        type: 'unlockWallet',
        data: [this.file, this.password]
      });
      worker.onmessage = e => {
        this.wallet = new WalletInterface(
          Buffer.from(e.data._privKey),
          false,
          keyStoreType
        );
        this.loading = false;
        if (!this.generateOnly) {
          this.toggleImportKeystoreFile(this.loading);
          this.toggleVerifyDetails(true, keyStoreType);
        } else {
          this.addWalletToStore('wallet');
          this.toggleGenerateWallet(false);
        }
      };
      worker.onerror = e => {
        e.preventDefault();
        this.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    },
    toggleImportKeystoreFile(bool) {
      if (bool) this.$refs.importKeystore.$refs.importKeystore.show();
      if (!bool) this.$refs.importKeystore.$refs.importKeystore.hide();
    },
    toggleImportPrivateKey(bool) {
      if (bool) this.$refs.importPrivateKey.$refs.importPrivateKey.show();
      if (!bool) this.$refs.importPrivateKey.$refs.importPrivateKey.hide();
    },
    toggleImportMnemonicPhrase(bool) {
      if (bool) this.$refs.mnemonicPhrase.$refs.mnemonicPhrase.show();
      if (!bool) this.$refs.mnemonicPhrase.$refs.mnemonicPhrase.hide();
    },
    toggleGenerateWallet(bool) {
      if (bool) this.$refs.generateNewWallet.$refs.generateNewWallet.show();
      if (!bool) this.$refs.generateNewWallet.$refs.generateNewWallet.hide();
    },
    toggleNetworkAddressModal(bool) {
      if (bool) this.$refs.networkAddress.$refs.networkAddress.show();
      if (!bool) this.$refs.networkAddress.$refs.networkAddress.hide();
    },
    toggleVerifyDetails(bool, title) {
      if (bool) this.$refs.verifyDetails.$refs.verifyDetails.show();
      if (!bool) this.$refs.verifyDetails.$refs.verifyDetails.hide();
      this.title = title;
    },
    updateFilePath(e) {
      this.filepath = e.replace('fakepath', 'user-path');
    },
    updateNickname(e) {
      this.nickname = e;
    },
    updateFile(e) {
      this.file = e;
    },
    updatePassword(e) {
      this.password = e;
    },
    updatePrivKey(e) {
      this.privateKey = e;
    },
    updateMnemonic(e) {
      if (Array.isArray(e)) {
        this.mnemonicPhrase = e.join(' ');
      } else {
        Toast.responseHandler('Invalid Mnemonic', Toast.ERROR);
      }
    },
    updateSelectedPath(e) {
      this.selectedAccountPath = e[0];
      this.selectedAddress = e[1];
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionAddWalletContainer.scss';
</style>
