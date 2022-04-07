<template>
  <!--
  ===================================================
  Step two: Generate Eth2 Address
  ===================================================
  -->
  <div>
    <div class="mx-auto mb-3" style="max-width: 550px">
      <div class="mew-heading-2 py-8 text-center">
        Here is your new Eth2 address
      </div>
      <border-block class="mt-4 pa-3 pa-sm-5">
        <!--
        ===================================================
        Eth2 Address
        ===================================================
        -->
        <div class="overlayBg rounded pa-5">
          <div class="mew-heading-3 mb-3">Your Eth2 Address</div>
          <div class="break-word mew-address">
            {{ eth2Address }}
          </div>
        </div>
        <!--
        ===================================================
        Recovery phrase
        ===================================================
        -->
        <div class="mt-8">
          <div class="mew-heading-3 mb-5 pl-md-5">
            1. Write down your recovery phrase
          </div>
          <border-block class="px-3 px-sm-7 py-4">
            <mnemonic-phrase-table :data="mnemonic" />
          </border-block>
        </div>
        <!--
        ===================================================
        Keystore
        ===================================================
        -->
        <div class="mt-10">
          <div class="mew-heading-3 mb-5 pl-md-5">
            2. Download your keystore file
          </div>
          <div
            class="d-block d-sm-flex align-center justify-space-between greyLight py-5 px-3 rounded"
          >
            <div class="d-flex align-center">
              <img
                src="@/assets/images/icons/icon-keystore-file.svg"
                alt="Keystore file"
                height="32"
              />
              <div class="ml-3">
                <div class="mew-heading-4">
                  Keystore file
                  <v-icon
                    v-if="downloadedKeystore"
                    size="16"
                    color="greenPrimary"
                    >mdi-checkbox-marked-circle</v-icon
                  >
                </div>
                <div
                  v-if="downloadedKeystore && keystoreName"
                  class="textLight--text"
                >
                  {{ keystoreName }}
                </div>
              </div>
            </div>
            <mew-button
              class="my-2"
              btn-size="small"
              title="Download"
              btn-style="outline"
              :loading="downloadingKeystore && !downloadedKeystore"
              :has-full-width="$vuetify.breakpoint.xs"
              @click.native="onDownload"
            />
          </div>

          <mew-warning-sheet
            v-if="downloadedKeystore"
            class="mt-4 mb-1"
            :description="keystoreFileWarning"
          />
        </div>
      </border-block>
      <!--
      ======================================================
      Back + Continue buttons
      ======================================================
      -->
      <div
        class="mt-10 d-flex flex-column-reverse flex-md-row align-center justify-center"
      >
        <mew-button
          :has-full-width="$vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          :title="buttonText"
          :disabled="!downloadedKeystore"
          @click.native="onContinue(false)"
        />
      </div>

      <!--
      ======================================================
      Create password + download keystore dialog
      ======================================================
      -->
      <generate-keystore-dialog
        :opened="onCreatePassword"
        @generate="generateKeystore"
        @onDialogStateChange="onDialogStateChange"
      />
    </div>
  </div>
</template>

<script>
import BorderBlock from '@/components/BorderBlock';
import GenerateKeystoreDialog from './GenerateKeystoreDialog';
import MnemonicPhraseTable from '@/components/MnemonicPhraseTable';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import KeyStore, { verifyKeystore } from '@myetherwallet/eth2-keystore';
import { createBlob } from '@/modules/create-wallet/handlers/helpers';

export default {
  components: { BorderBlock, GenerateKeystoreDialog, MnemonicPhraseTable },
  data() {
    return {
      ks: {},
      mnemonic: [],
      eth2Address: '',
      downloadedKeystore: false,
      downloadingKeystore: false,
      keystoreFileWarning:
        "Don't lose your Keystore file / password and Recovery phrase. They hold your keys and are necessary future access. MEW will not be able to recover them for you so make sure to keep them safe.",
      keystoreJson: '',
      keystoreName: '',
      onCreatePassword: false,
      link: {}
    };
  },
  computed: {
    buttonText() {
      return this.downloadedKeystore
        ? 'Next: upload your keystore file'
        : 'Continue after downloading keystore file';
    }
  },
  mounted() {
    /**
     * Create Keystore handler
     * then create address, mnemonic
     */
    this.ks = new KeyStore();
    this.createAddress();
    this.createMnemonic();
  },
  methods: {
    /**
     * Create Eth2 Address
     */
    async createAddress() {
      const address = await this.ks.getPublicKey(0, false);
      this.eth2Address = address.toString('hex');
    },
    /**
     * Create Mnemonic
     */
    async createMnemonic() {
      const mnemonic = await this.ks.getMnemonic();
      this.mnemonic = mnemonic.split(' ');
    },
    /**
     * Gets triggered by emit from StakedCreatePasswordDialog
     * stores the state of the dialog (opened or closed)
     */
    onDialogStateChange(newVal) {
      this.onCreatePassword = newVal;
    },
    /**
     * Gets triggered from clicking the Download button
     * if keystore has not been downloaded, then create pw modal will pop up
     * otherwise will download the same keystore file
     */
    onDownload() {
      if (this.downloadedKeystore) {
        this.downloadKeystore();
        return;
      }
      this.onCreatePassword = !this.onCreatePassword;
    },
    /**
     * Generate keystore json
     */
    async generateKeystore(pw) {
      const password = pw;
      this.downloadingKeystore = true;
      this.onCreatePassword = false;
      const toWithdrawalKeystore = await this.ks.toWithdrawalKeystore(password);
      this.keystoreJson = createBlob(toWithdrawalKeystore, 'mime');
      this.keystoreName =
        'keystore-' +
        toWithdrawalKeystore.path.split('/').join('_') +
        '-' +
        Date.now() +
        '.json';
      this.downloadKeystore();
      /**
       * Verify keystore
       */
      await verifyKeystore(toWithdrawalKeystore, password).catch(error => {
        Toast(error, {}, ERROR);
      });
    },
    /**
     * Download keystore file
     */
    downloadKeystore() {
      this.link = document.createElement('a');
      this.link.href = this.keystoreJson;
      this.link.download = this.keystoreName;
      this.link.click();
      this.downloadedKeystore = true;
    },
    /**
     * Emits onContinue to go to next step
     * if skipped @returns true means do not need to generate
     * a new keystore
     */
    onContinue(skipped) {
      this.$emit('onContinue', {
        onStep: 2,
        isSkipped: skipped,
        address: this.eth2Address
      });
      URL.revokeObjectURL(this.link.href);
    }
  }
};
</script>
