<template>
  <!--
    ===================================================
    Step three: Upload keystore
    ===================================================
    -->
  <div>
    <v-divider />

    <div class="mx-auto mb-3" style="max-width: 550px">
      <div class="mew-heading-2 pt-8 pb-7 text-center">
        {{ titleDetails.title }}
      </div>
      <!--
    ===================================================
    Upload keystore container
    ===================================================
    -->
      <div class="upload-container rounded pa-3 pa-sm-8">
        <!--
      ===================================================
      Title on mount (uploading and uploaded = false)
      ===================================================
      -->

        <div
          v-if="!uploading && !uploaded"
          :class="[
            'd-flex align-center flex-column text-center',
            skipped ? 'mb-12' : 'mb-6'
          ]"
        >
          <img
            src="@/assets/images/icons/icon-shield.svg"
            alt="Shield"
            height="50"
            class="mb-7 mx-auto d-block"
          />
          <div class="mew-heading-3">
            {{ titleDetails.subtitle }}
          </div>
          <span v-if="!skipped" class="mew-body mt-2">
            {{ titleDetails.desc }}
          </span>
        </div>
        <!--
    ===================================================
    Uploading progress bar (uploading = true and uploaded = false)
    ===================================================
    -->
        <v-progress-linear
          v-if="uploading && !uploaded"
          class="mb-12"
          indeterminate
        />
        <!--
    ===================================================
    Title on uploaded  (uploaded = true)
    ===================================================
    -->
        <div
          v-if="uploaded"
          class="
            text-center
            d-flex
            align-center
            flex-column
            font-weight-bold
            mb-6
          "
        >
          <img
            v-if="hasError"
            src="@/assets/images/icons/icon-shield-crossed.svg"
            alt="Shield"
            height="50"
            class="mb-7 mx-auto d-block"
          />

          <img
            v-if="!hasError"
            src="@/assets/images/icons/icon-shield-checked.svg"
            alt="Shield"
            height="50"
            class="mb-7 mx-auto d-block"
          />

          <span
            :class="[
              'mew-heading-3',
              hasError ? 'error--text' : 'titlePrimary--text'
            ]"
          >
            {{ uploadedText.title }}
          </span>
          <div
            style="max-width: 420px"
            :class="[
              'mt-2 mew-body',
              hasError ? 'error--text' : 'warning--text text--darken-2'
            ]"
          >
            {{ uploadedText.desc }}
          </div>
        </div>
        <!--
    ===================================================
    Upload input
    ===================================================
    -->
        <div
          class="
            tableHeader
            mb-8
            input-container
            d-block d-sm-flex
            rounded
            align-center
            justify-space-between
            pa-5
          "
        >
          <div class="d-flex align-center">
            <mew-icon :img-height="32" icon-name="keystore" />
            <div
              class="
                ml-3
                file-name-container
                mew-heading-4
                textSecondary--text
                truncate
              "
            >
              {{ inputTitle }}
            </div>
            <v-icon v-if="uploaded && !hasError" size="16" color="primary"
              >mdi-checkbox-marked-circle</v-icon
            >
          </div>
          <mew-button
            class="my-2"
            btn-size="small"
            title="Browse..."
            btn-style="outline"
            :has-full-width="$vuetify.breakpoint.xs"
            @click.native="$refs.inputUpload.click()"
          />
          <input
            v-show="false"
            ref="inputUpload"
            type="file"
            accept=".json"
            @change="upload"
          />
        </div>
      </div>
      <!--
    ===================================================
    Eth2 Address
    ===================================================
    -->
      <div
        v-if="newEth2Address && uploaded"
        class="overlayBg rounded pa-5 mt-2"
      >
        <div class="mew-heading-3 mb-3">Your Eth2 Address</div>
        <div class="break-word mew-address">
          {{ newEth2Address }}
        </div>
      </div>
      <!--
    ===================================================
    Back/Continue Buttons
    ===================================================
    -->
      <div
        class="
          mt-7
          d-flex
          flex-column-reverse flex-md-row
          align-center
          justify-center
        "
      >
        <mew-button
          :has-full-width="$vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          title="Back"
          btn-style="outline"
          @click.native="onBack"
        />
        <mew-button
          :has-full-width="$vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          title="Next: Review my stake"
          :disabled="!newEth2Address || !uploaded || hasError"
          @click.native="onContinue"
        >
        </mew-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    skipped: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileName: '',
      newEth2Address: '',
      hasError: false,
      uploading: false,
      uploaded: false
    };
  },
  computed: {
    /**
     * Text to display on mount
     * @returns object
     */
    titleDetails() {
      return {
        title: this.skipped
          ? 'Upload your keystore file'
          : 'Verify keystore file',
        subtitle: this.skipped
          ? 'Upload the Eth2 address that you would like to use'
          : 'Upload the same Eth2 keystore file you just downloaded.',
        desc: 'This is so we can check its integrity, and to make sure you are using the correct file and be able to claim your ETH in the future.'
      };
    },
    /**
     * Text after uploading
     * Differs based on if it is uploading or verifying keystore file
     * @returns object
     */
    uploadedText() {
      if (this.skipped) {
        return {
          title:
            this.uploaded && !this.hasError
              ? 'Keystore file uploaded'
              : 'Invalid keystore file',
          desc:
            this.uploaded && !this.hasError
              ? 'Is this the right keystore file? Double check that this is the address you would like to use before you continue.'
              : 'This is not an Eth2 address. If you do not have an Eth2 address, go back to step 2 and generate one.'
        };
      }
      return {
        title:
          this.uploaded && !this.hasError
            ? 'Keystore verified'
            : 'This is the wrong keystore file',
        desc:
          this.uploaded && !this.hasError
            ? 'Please keep this file safe. Your ETH and all rewards will be withdrawable to this address.'
            : 'This keystore file is different from the one you just created. Please upload your new keystore file.'
      };
    },
    /**
     * Title for the file input
     * @returns string
     */
    inputTitle() {
      if (this.uploading && !this.uploaded && this.skipped) {
        return 'Uploading';
      }
      if (this.uploading && !this.uploaded && !this.skipped) {
        return 'Verifying';
      }
      if (this.uploaded && !this.hasError) {
        return this.fileName;
      }
      return 'Upload your keystore file';
    }
  },
  methods: {
    /**
     * On file upload
     * Checks it is a valid Eth2 keystore file
     * and errors if not
     */
    upload(e) {
      this.uploading = true;
      const self = this;
      const reader = new FileReader();
      reader.onloadend = function (evt) {
        try {
          self.file = JSON.parse(evt.target.result);
          if (
            self.file.version === 4 &&
            self.file.pubkey &&
            self.file.pubkey.length === 96
          ) {
            self.newEth2Address = self.file.pubkey;
            self.hasError = false;
            if (!self.skipped && self.newEth2Address !== self.address) {
              self.hasError = true;
              self.newEth2Address = '';
            }
          } else {
            self.hasError = true;
            self.newEth2Address = '';
          }
        } catch (e) {
          self.hasError = true;
          self.newEth2Address = '';
        }
        self.uploaded = true;
      };
      reader.readAsBinaryString(e.target.files[0]);
      this.fileName = e.target.files[0].name;
      this.uploading = false;
    },
    /**
     * Emits back to go to previous step
     */
    onBack() {
      this.$emit('back');
    },
    /**
     * Emits onContinue to go to next step
     */
    onContinue() {
      this.$emit('onContinue', { onStep: 3, address: this.newEth2Address });
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-container {
  border: 1px solid var(--v-inputBorder-base);
  .file-name-container {
    max-width: 212px;
  }
}
</style>
