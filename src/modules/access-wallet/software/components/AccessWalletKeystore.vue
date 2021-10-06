<template>
  <mew-stepper :items="stepperItems" :on-step="step">
    <!--
    =====================================================================================
      Step 1: Upload Keystore Files
    =====================================================================================
    -->
    <template v-if="step === 1" #stepperContent1>
      <v-row class="align-start justify-space-between">
        <v-col cols="12" sm="6">
          <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
          <div class="headline font-weight-bold">Select your Keystore File</div>
          <p class="mb-3 mb-sm-10 mb-md-5">
            Please select keystore file that unlocks your wallet.
          </p>
          <div class="d-flex align-center justify-center d-sm-none">
            <img
              src="@/assets/images/icons/keystore-file.jpg"
              alt="Keystore File"
              style="width: 75%"
            />
          </div>
          <mew-button
            title="Select File"
            btn-style="outline"
            color-theme="primary"
            btn-size="xlarge"
            :has-full-width="true"
            :shows-active-state="true"
            @click.native="uploadBtn"
          />
          <input
            ref="jsonInput"
            type="file"
            name="file"
            style="display: none"
            @change="uploadFile"
          />
        </v-col>
        <v-col cols="12" sm="6" class="d-none d-sm-flex">
          <div class="d-flex align-start justify-sm-end">
            <img
              src="@/assets/images/icons/keystore-file.jpg"
              alt="Keystore File"
              style="width: 75%"
            />
          </div>
        </v-col>
      </v-row>
    </template>
    <!--
    =====================================================================================
      Step 2: Enter Password
    =====================================================================================
    -->
    <template v-if="step === 2" #stepperContent2>
      <v-sheet color="white" class="border-radius--10px pa-4 pa-md-12">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
        <div class="headline font-weight-bold">Enter Password</div>
        <div class="mb-5">Enter your password to unlock your wallet.</div>
        <form @submit.prevent="unlockBtn">
          <v-row class="align-stretch">
            <v-col cols="12">
              <mew-input
                v-model="password"
                label="Enter Password"
                placeholder="Enter my keystore password"
                type="password"
              />
            </v-col>
            <v-col cols="12" class="pt-0">
              <app-btn-row
                v-if="!isUnlockingKeystore"
                class="pb-5"
                next-btn-text="Access Wallet"
                :next-btn-method="unlockBtn"
                :back-btn-method="backStepOne"
              />
              <!--
            =====================================================================================
              Unlocking State: isUnlockingKeystore = true
            =====================================================================================
            -->
              <v-row v-else justify="center" align="center" class="pt-5 pb-9">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <p class="mb-0 mx-3">
                  Sit tight while we are unlocking your wallet
                </p>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </v-sheet>
    </template>
  </mew-stepper>
</template>

<script>
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import AppBtnRow from '@/core/components/AppBtnRow';

export default {
  name: 'AccessWalletKeystore',
  components: {
    AppBtnRow
  },
  props: {
    handlerAccessWallet: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      step: 1,
      file: {},
      password: '',
      stepperItems: [
        {
          step: 1,
          name: 'Select File'
        },
        {
          step: 2,
          name: 'Enter Password'
        }
      ],
      isUnlockingKeystore: false
    };
  },

  methods: {
    /**
     * Sets keystore file and directs to step 2
     */
    uploadFile(e) {
      const reader = new FileReader();
      reader.onloadend = evt => {
        try {
          this.file = JSON.parse(evt.target.result);
          this.step = 2;
        } catch (e) {
          Toast(e.message, {}, ERROR);
        }
      };
      reader.readAsBinaryString(e.target.files[0]);
    },
    /**
     * Opens file input control
     */
    uploadBtn() {
      const jsonInput = this.$refs.jsonInput;
      jsonInput.value = '';
      jsonInput.click();
    },
    /**
     * Unlocks Keystre wallet file
     * Sets isUnlockingKeystore = true , to dispaly loading state
     * On Error - dispatches Toast on error and sets isUnlockingKeystore = false
     */
    unlockBtn() {
      this.isUnlockingKeystore = true;
      this.handlerAccessWallet
        .unlockKeystoreWallet(this.file, this.password)
        .then(res => {
          if (res) {
            this.$emit('unlock');
            this.isUnlockingKeystore = false;
          }
        })
        .catch(e => {
          this.isUnlockingKeystore = false;
          Toast(e.message, {}, ERROR);
        });
    },
    /**
     * Methods changes stepper to step 1
     * Used in STEP 2
     */
    backStepOne() {
      this.step = 1;
    }
  }
};
</script>
