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
        :unlock-mnemonic-wallet="unlockKeystoreWallet"
        @keystore="handleKeystoreUpload"
      />
    </template>
  </mew-overlay>
</template>

<script>
import accessKeystore from '../access-keystore/AccessKeystore';
import accessMnemonic from '../access-mnemonic/AccessMnemonic';
import Keystore from '@/modules/wallets/utils/Keystore.js';
import { MnemonicWallet } from '@/modules/wallets/utils/software';

const TITLES = {
  keystoreFile: 'Keystore File',
  mnemonic: 'Mnemonic Phrase',
  privateKey: 'Private Key',
  keystorePasasword: 'Keystore File Password'
};

const TYPES = ['keystoreFile', 'mnemonic', 'privateKey', 'keystorePasasword'];
export default {
  name: 'AccessWalletSoftware',
  components: {
    accessKeystore,
    accessMnemonic
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
      file: {},
      keystoreModule: {}
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
      return this.step && this.type === 'mnemonic';
    },
    showPrivKey() {
      return this.step && this.type === 'privateKey';
    }
  },
  mounted() {
    console.log(window.Worker);
    this.keystoreInstance = new Keystore(
      true /*temporary value*/,
      window.Worker,
      window.origin
    );
  },
  methods: {
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
    unlockKeystoreWallet(e, password = '123456789') {
      this.keystoreInstance.unlock(this.file, password).catch(console.log);
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
