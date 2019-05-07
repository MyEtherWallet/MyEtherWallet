<template>
  <div class="add-wallet-container">
    <verify-details-modal
      ref="verifyDetails"
      :wallet="wallet"
      :title="title"
      :back="back"
      :add-wallet="addWalletToStore"
      @nickname="updateNickname"
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
import { WalletInterface } from '@/wallets';
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Toast, ExtensionHelpers } from '@/helpers';

import byJsonImgHov from '@/assets/images/icons/button-json-hover.svg';
import byMnemImgHov from '@/assets/images/icons/button-mnemonic-hover.svg';
import privKeyImgHov from '@/assets/images/icons/button-key-hover.svg';
import generateImgHov from '@/assets/images/icons/button-generate-hover.svg';
import AccessWalletButton from '@/layouts/AccessWalletLayout/components/AccessWalletButton';
import ImportKeystoreModal from '../../components/ImportKeystoreModal';
import VerifyDetailsModal from '../../components/VerifyDetailsModal';

export default {
  components: {
    'access-wallet-button': AccessWalletButton,
    'import-keystore-modal': ImportKeystoreModal,
    'verify-details-modal': VerifyDetailsModal
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
            console.log('REEEEEEEE');
          }
        },
        {
          icon: byMnemImgHov,
          title: 'Mnemonic Phrase',
          warning: 'Not Recommended',
          func: () => {
            console.log('REEEEEEEE');
          }
        },
        {
          icon: privKeyImgHov,
          title: `Private \n Key`,
          warning: 'Not Recommended',
          func: () => {
            console.log('REEEEEEEE');
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
      nickname: ''
    };
  },
  methods: {
    storeWalletCb() {
      this.loading = false;
      this.toggleVerifyDetails(false, '');
      Toast.responseHandler(
        `Successfully added ${this.nickname} wallet!`,
        Toast.SUCCESS
      );
    },
    addWalletToStore() {
      this.loading = true;
      ExtensionHelpers.addWalletToStore(
        this.wallet.getAddressString(),
        JSON.stringify(this.file),
        this.nickname,
        this.storeWalletCb
      );
    },
    toggleImportKeystoreFile(bool) {
      if (bool) this.$refs.importKeystore.$refs.importKeystore.show();
      if (!bool) this.$refs.importKeystore.$refs.importKeystore.hide();
    },
    toggleVerifyDetails(bool, title) {
      if (bool) this.$refs.verifyDetails.$refs.verifyDetails.show();
      if (!bool) this.$refs.verifyDetails.$refs.verifyDetails.hide();
      this.title = title;
    },
    back() {
      if (this.title === keyStoreType) {
        this.toggleImportKeystoreFile(true);
      }
      this.toggleVerifyDetails(false, '');
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
        this.toggleImportKeystoreFile(this.loading);
        this.toggleVerifyDetails(true, keyStoreType);
      };
      worker.onerror = e => {
        e.preventDefault();
        this.loading = false;
        Toast.responseHandler(e, Toast.ERROR);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ExtensionAddWalletContainer.scss';
</style>
