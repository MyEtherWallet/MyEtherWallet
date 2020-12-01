<template>
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Cancel"
    :back="accessBack"
    :close="overlayClose"
    :left-btn-text="step > 0 ? 'Back' : ''"
    @closeOverlay="overlayClose"
  >
    <template #mewOverlayBody>
      <v-sheet color="transparent" max-width="650px" class="mx-auto">
        <v-row v-if="!step">
          <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
            <mew-super-button
              btn-mode="small-right-image"
              :title="btn.label"
              :subtitle="btn.description"
              :right-icon="btn.icon"
              icon-type="img"
              color-theme="basic"
              @click.native="btn.fn"
            />
          </v-col>
        </v-row>
        <access-keystore
          v-else-if="showKeystore"
          :btn-call="btnCall"
          :unlock-keystore-wallet="unlockKeystoreWallet"
          :step="step"
          @keystore="handleKeystoreUpload"
          @updateStep="handleStep"
        />
        <access-mnemonic
          v-else-if="showMnemonic"
          :btn-call="btnCall"
          :unlock-mnemonic-wallet="unlockMnemonicWallet"
          :step="step"
          :set-mnemonic-path="setMnemonicPath"
          :hw-wallet-instance="hwWalletInstance"
          :set-address="setAddress"
        />
        <access-private-key
          v-else-if="showPrivKey"
          :unlock-private-key-wallet="unlockPrivateKeyWallet"
        />
        <v-col cols="12" sm="12">
          <mew-warning-sheet
            title="Not Recommended"
            description="This information is sensetive, and these options should only be used in offline settings by experienced crypto users."
            :link-obj="warningSheetObj"
          />
        </v-col>
      </v-sheet>
      <div class="spacer-y-medium" />
    </template>
  </mew-overlay>
</template>

<script>
import mewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import accessKeystore from '../access-keystore/AccessKeystore';
import accessMnemonic from '../access-mnemonic/AccessMnemonic';
import accessPrivateKey from '../access-private-key/AccessPrivateKey';
import { MnemonicWallet } from '@/modules/wallets/utils/software';
import WalletInterface from '@/modules/wallets/utils/WalletInterface';
import {
  PRIV_KEY as privKeyType,
  KEYSTORE as keyStoreType
} from '@/modules/wallets/utils/bip44/walletTypes';
import { mapActions, mapState } from 'vuex';
import { unlockKeystore } from '@/modules/wallets/utils/helpers.js';
import { Toast, ERROR, SENTRY } from '@/components/toast';

const TITLES = {
  keystoreFile: 'Keystore File',
  mnemonic: 'Mnemonic Phrase',
  privateKey: 'Private Key',
  keystorePassword: 'Keystore File Password',
  mnemonicPath: 'Mnemonic Wallet Path',
  mnemonicAddress: 'Confirm Network & Address'
};

const TYPES = [
  'keystoreFile',
  'mnemonic',
  'privateKey',
  'keystorePassword',
  'mnemonicPath',
  'mnemonicAddress'
];

export default {
  name: 'AccessWalletSoftware',
  components: {
    accessKeystore,
    accessMnemonic,
    accessPrivateKey,
    mewSuperButton
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      titles: TITLES,
      warningSheetObj: {
        title: 'Learn More',
        url: 'https://kb.myetherwallet.com/en/offline/using-mew-offline'
      },
      buttons: [
        {
          label: 'Keystore',
          description: 'Access via Keystore',
          icon: require('@/assets/images/icons/icon-keystore-file.svg'),
          fn: () => {
            this.btnCall('keystoreFile');
          }
        },
        {
          label: 'Mnemonic Phrase',
          description: 'Access via Mnemonic Phrase',
          icon: require('@/assets/images/icons/icon-mnemonic.svg'),
          fn: () => {
            this.btnCall('mnemonic');
          }
        },
        {
          label: 'Private Key',
          description: 'Access via Private Key',
          icon: require('@/assets/images/icons/icon-private-key-grey.svg'),
          fn: () => {
            this.btnCall('privateKey');
          }
        }
      ],
      type: '',
      step: 0,
      file: {},
      hwWalletInstance: {},
      steps: {}
    };
  },

  computed: {
    ...mapState('global', ['path']),
    title() {
      return !this.step ? 'Software' : this.titles[this.steps[this.step]];
    },
    showKeystore() {
      return (
        this.step &&
        (this.type === 'keystoreFile' || this.type === 'keystorePassword')
      );
    },
    showMnemonic() {
      return (
        this.step &&
        (this.type === 'mnemonic' ||
          this.type === 'mnemonicPath' ||
          this.type === 'mnemonicAddress')
      );
    },
    showPrivKey() {
      return this.step && this.type === 'privateKey';
    }
  },
  watch: {
    step(newVal, oldVal) {
      if (oldVal) {
        if (oldVal > newVal) {
          delete this.steps[oldVal];
        }
      }
    }
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    handleStep(e) {
      this.step += e;
    },
    btnCall(str) {
      if (TYPES.includes(str)) {
        this.type = str;
      } else {
        throw new Error('Not a valid type!');
      }
      this.step += 1;
      this.steps[this.step] = str;
    },
    handleKeystoreUpload(e) {
      this.file = e;
      this.btnCall('keystorePassword');
    },
    unlockKeystoreWallet(password) {
      unlockKeystore(this.file, password)
        .then(res => {
          // not sure what res is for now
          const obj = {
            file: this.file,
            name: res.getV3Filename()
          };

          const walletInstance = new WalletInterface(
            Buffer.from(res.privateKey),
            false,
            keyStoreType,
            '',
            JSON.stringify(obj)
          );

          this.setAddress(walletInstance);
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
        });
    },
    unlockPrivateKeyWallet(privateKey) {
      const walletInstance = new WalletInterface(
        privateKey,
        false,
        privKeyType
      );
      this.setWallet([walletInstance])
        .then(() => {
          if (this.path !== '') {
            this.$router.push({ path: this.path });
          } else {
            this.$router.push({ name: 'Wallets' });
          }
        })
        .catch(e => {
          Toast(e, {}, SENTRY);
        });
    },
    unlockMnemonicWallet(phrase, password = '') {
      MnemonicWallet(phrase, password).then(wallet => {
        this.hwWalletInstance = wallet;
        this.btnCall('mnemonicPath');
      });
    },
    setMnemonicPath() {
      this.btnCall('mnemonicAddress');
    },
    setAddress(wallet) {
      try {
        this.setWallet([wallet])
          .then(() => {
            if (this.path !== '') {
              this.$router.push({ path: this.path });
            } else {
              this.$router.push({ name: 'Wallets' });
            }
          })
          .catch(e => {
            Toast(e, {}, SENTRY);
          });
      } catch (e) {
        Toast(e, {}, SENTRY);
      }
    },
    accessBack() {
      if (!this.step) {
        this.close('showSoftware');
        return;
      }
      this.step -= 1;
    },
    overlayClose() {
      this.close('showSoftware');
    }
  }
};
</script>

<style lang="scss" scoped></style>
