<template>
  <!--
    ===================================================
    Step two: Generate Eth2 Address
    ===================================================
    -->
  <div class="mx-auto pb-15" style="max-width: 550px">
    <div class="mew-heading-2 py-12 text-center">
      Here is your new Eth2 Address
    </div>
    <div
      class="
        skip-container
        d-flex
        rounded
        align-center
        justify-space-between
        tableHeader
        px-5
        py-4
      "
    >
      <!--
    ===================================================
    Already have Eth2 Address
    ===================================================
    -->
      <span>Already have Eth2 address?</span>
      <span class="d-flex align-center primary--text"
        >Skip this step
        <img
          height="17"
          class="ml-2"
          src="@/assets/images/icons/button-circle-right-arrow.svg"
          alt="right arrow"
        />
      </span>
    </div>
    <div class="details-container mt-4 pa-5">
      <div class="overlayBg rounded pa-5">
        <!--
    ===================================================
   Eth2 Address
    ===================================================
    -->
        <div class="mew-heading-3 mb-3">Your Eth2 Address</div>
        <div class="word-wrap--break-word">
          {{ eth2Address }}
        </div>
      </div>
      <!--
    ===================================================
    Recovery phrase
    ===================================================
    -->
      <div class="mt-8">
        <div class="mew-heading-3 mb-5">1. Write down your recovery phrase</div>
        <div class="mnemonic-container px-7 py-4">
          <mnemonic-phrase-table :data="mnemonic" />
        </div>
      </div>
      <!--
    ===================================================
    Keystore
    ===================================================
    -->

      <div class="mt-10">
        <div class="mew-heading-3 mb-5">2. Download your keystore file</div>
        <div
          class="
            d-block d-sm-flex
            align-center
            justify-space-between
            tableHeader
            py-5
            px-3
            rounded
          "
        >
          <div class="d-flex align-center">
            <img
              src="@/assets/images/icons/icon-keystore-file.svg"
              alt="Keystore file"
            />
            <div class="ml-2">
              <div class="mew-heading-4">
                Keystore file
                <v-icon v-if="downloadedKeystore" size="16" color="primary"
                  >mdi-checkbox-marked-circle</v-icon
                >
              </div>
              <div class="textSecondary--text">
                {{ keystoreName }}
              </div>
            </div>
          </div>
          <mew-button
            class="my-2 mr-1"
            btn-size="small"
            title="Download"
            btn-style="outline"
            :has-full-width="$vuetify.breakpoint.xs"
            @click.native="onCreatePassword = true"
          />
        </div>

        <mew-warning-sheet
          v-if="downloadedKeystore"
          class="mt-4"
          :description="keystoreFileWarning"
        />
      </div>
    </div>
    <!--
    ======================================================
    Back + Continue buttons
    ======================================================
    -->
    <div
      class="
        mt-10
        d-flex
        flex-column-reverse flex-md-row
        align-center
        justify-center
      "
    >
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Back"
        btn-style="outline"
      />
      <mew-button
        btn-size="xlarge"
        class="d-block ma-2"
        title="Continue after downloading keystore file"
        :disabled="!downloadedKeystore"
      >
      </mew-button>
    </div>

    <!--
    ======================================================
    Create password + download keystore dialog
    ======================================================
    -->
    <staked-create-password-dialog
      :opened="onCreatePassword"
      @generate="generateKeystore"
    />
  </div>
</template>

<script>
import StakedCreatePasswordDialog from '../StakedCreatePasswordDialog.vue';
import MnemonicPhraseTable from '@/components/MnemonicPhraseTable';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import KeyStore, { verifyKeystore } from '@myetherwallet/eth2-keystore';
import { createBlob } from '@/modules/create-wallet/handlers/helpers';

export default {
  components: { StakedCreatePasswordDialog, MnemonicPhraseTable },
  data() {
    return {
      ks: {},
      mnemonic: [],
      eth2Address: '',
      downloadedKeystore: false,
      keystoreFileWarning:
        "Don't lose your Keystore file / password and Recovery phrase. They hold your keys and are necessary future access. MEW will not be able to recover them for you so make sure to keep them safe.",
      keystoreJson: '',
      keystoreName: '',
      password: '',
      onCreatePassword: false
    };
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
     * Generate keystore json
     */
    async generateKeystore(pw) {
      this.password = pw;
      this.onCreatePassword = false;
      const toWithdrawalKeystore = await this.ks.toWithdrawalKeystore(
        this.password
      );
      this.keystoreJson = createBlob(toWithdrawalKeystore, 'mime');
      this.keystoreName =
        'keystore-' +
        toWithdrawalKeystore.path.split('/').join('_') +
        '-' +
        Date.now() +
        '.json';
      this.downloadKeystore();
      // verify keystore
      await verifyKeystore(toWithdrawalKeystore, this.password).catch(error => {
        Toast(error, ERROR);
      });
    },
    /**
     * Download keystore file
     */
    downloadKeystore() {
      const link = document.createElement('a');
      link.href = this.keystoreJson;
      link.download = this.keystoreName;
      link.click();
      URL.revokeObjectURL(link.href);
      this.downloadedKeystore = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.skip-container {
  height: 50px;
}
.details-container {
  border: 1px solid var(--v-inputBorder-base);
}
.mnemonic-container {
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 6px;
}
.terms-container {
  border-radius: 6px;
}
</style>
