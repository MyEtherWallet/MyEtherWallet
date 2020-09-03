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
      <access-keystore-overlay
        v-else-if="step === 1"
        :btn-call="btnCall"
        :unlock-keystore-wallet="unlockKeystoreWallet"
        @keystore="handleKeystoreUpload"
      />
    </template>
  </mew-overlay>
</template>

<script>
import accessKeystoreOverlay from '../access-keystore-overlay/AccessKeystoreOverlay';
import Keystore from '@/modules/wallets/utils/Keystore.js';

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
    accessKeystoreOverlay
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
    }
  },
  mounted() {
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
      console.log('received file', e);
      this.file = e;
    },
    unlockKeystoreWallet(password, file) {
      console.log('got these:', password, file);
      this.keystoreInstance.unlock(file, password);
    },
    accessBack() {
      if (!this.step) {
        this.close('showSoftware');
        return;
      }
      this.step -= 1;
    },
    overlayClose() {
      console.log('got here?? 12345');
      this.close('showSoftware');
    }
  }
};
</script>

<style lang="scss" scoped></style>
