<template>
  <mew-overlay
    :show-overlay="open"
    :title="title"
    right-btn-text="Cancel"
    :back="accessBack"
    :close="overlayClose"
    @closeOverlay="close"
  >
    <template v-slot:mewOverlayBody>
      <div v-if="!step">
        <v-sheet color="transparent" max-width="650px" class="mx-auto px-5">
          <v-row>
            <v-col v-for="(btn, key) in buttons" :key="key" cols="12" sm="12">
              <mew-super-button
                :title="btn.label"
                :subtitle="btn.description"
                :right-icon="btn.icon"
                icon-type="img"
                color-theme="basic"
                @click.native="btn.fn"
              />
            </v-col>
            <v-col cols="12" sm="12">
              <warning-sheet
                title="Not Recommended"
                description="This information is sensetive, and these options should only be used in offline settings by experienced crypto users."
                :link-obj="warningSheetObj"
              />
            </v-col>
          </v-row>
        </v-sheet>
        <div class="spacer-y-medium" />
      </div>
      <access-keystore
        v-else-if="showKeystore"
        :btn-call="btnCall"
        :unlock-keystore-wallet="unlockKeystoreWallet"
        @keystore="handleKeystoreUpload"
      />
      <access-mnemonic
        v-else-if="showMnemonic"
        :btn-call="btnCall"
        :unlock-mnemonic-wallet="unlockMnemonicWallet"
      />
      <access-private-key
        v-else-if="showPrivKey"
        :unlock-private-key-wallet="unlockPrivateKeyWallet"
      />
    </template>
  </mew-overlay>
</template>

<script>
import accessKeystore from '../access-keystore/AccessKeystore';
import accessMnemonic from '../access-mnemonic/AccessMnemonic';
import accessPrivateKey from '../access-private-key/AccessPrivateKey';
import { MnemonicWallet } from '@/modules/wallets/utils/software';
import WalletInterface from '@/modules/wallets/utils/WalletInterface';
import {
  PRIV_KEY as privKeyType,
  KEYSTORE as keyStoreType
} from '@/modules/wallets/utils/bip44/walletTypes';
import { mapActions } from 'vuex';
import { unlockKeystore } from '@/modules/wallets/utils/helpers.js';

const TITLES = {
  keystoreFile: 'Keystore File',
  mnemonic: 'Mnemonic Phrase',
  privateKey: 'Private Key',
  keystorePasasword: 'Keystore File Password',
  mnemonicPath: 'Mnemonic Wallet Path'
};

const TYPES = [
  'keystoreFile',
  'mnemonic',
  'privateKey',
  'keystorePasasword',
  'mnemonicPath'
];

export default {
  name: 'AccessWalletSoftware',
  components: {
    accessKeystore,
    accessMnemonic,
    accessPrivateKey
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
          description: 'Access via Mnemonic PHrase',
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
      file: {}
    };
  },
  computed: {
    title() {
      return !this.step ? 'Software' : this.titles[this.type];
    },
    showKeystore() {
      return (
        this.step &&
        (this.type === 'keystoreFile' || this.type === 'keystorePasasword')
      );
    },
    showMnemonic() {
      return (
        this.step && (this.type === 'mnemonic' || this.type === 'mnemonicPath')
      );
    },
    showPrivKey() {
      return this.step && this.type === 'privateKey';
    }
  },
  methods: {
    ...mapActions(['decryptWallet']),
    btnCall(str) {
      if (TYPES.includes(str)) {
        this.type = str;
      } else {
        throw new Error('Not a valid type!');
      }
      this.step = 1;
    },
    handleKeystoreUpload(e) {
      this.file = e;
    },
    unlockKeystoreWallet(e, password) {
      unlockKeystore(this.file, password)
        .then(res => {
          // not sure what res is for now
          const obj = {
            file: this.file,
            name: res.data.filename
          };

          const walletInstance = new WalletInterface(
            Buffer.from(e.data._privKey),
            false,
            keyStoreType,
            '',
            JSON.stringify(obj)
          );

          this.decryptWallet([walletInstance])
            .then(() => {
              this.$router.push({ name: 'Dashboard' });
            })
            .catch(e => {
              console.log(e);
            });
        })
        .catch(e => {
          console.log(e);
        });
    },
    unlockPrivateKeyWallet(privateKey) {
      const walletInstance = new WalletInterface(
        privateKey,
        false,
        privKeyType
      );
      this.decryptWallet([walletInstance])
        .then(() => {
          this.$router.push({ name: 'Dashboard' });
        })
        .catch(e => {
          console.log(e);
        });
    },
    unlockMnemonicWallet(phrase, password = '') {
      MnemonicWallet(phrase, password).then(wallet => {
        // use design for paths found in keepkey's designs
        console.log(wallet);
      });
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
