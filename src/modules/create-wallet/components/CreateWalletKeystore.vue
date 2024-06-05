<template>
  <white-sheet style="max-width: 650px; width: 100%" class="mx-auto py-4 px-6">
    <mew-stepper :items="items" :on-step="step" class="mx-md-0">
      <!-- ===================================================================================== -->
      <!-- Step 1: Create Password -->
      <!-- ===================================================================================== -->
      <template v-if="step === 1" #stepperContent1>
        <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
        <div class="headline font-weight-bold mb-5">Create password</div>

        <!-- ===================================================================================== -->
        <!-- Enter Password -->
        <!-- ===================================================================================== -->
        <mew-input
          v-model="password"
          :hint="
            password && password.length < 8
              ? 'Password must be 8 or more characters'
              : ''
          "
          label="Password"
          placeholder="Enter Password"
          :has-clear-btn="true"
          class="flex-grow-1 mb-2 CreateWalletKeystorePasswordInput"
          :error-messages="passwordMessages"
          type="password"
        />

        <!-- ===================================================================================== -->
        <!-- Confirm Password -->
        <!-- ===================================================================================== -->
        <mew-input
          v-model="cofirmPassword"
          hint=""
          label="Confirm Password"
          placeholder="Confirm password"
          class="flex-grow-1 CreateWalletKeystoreConfirmPWInput"
          type="password"
          :error-messages="errorPasswordConfirmation"
        />

        <!-- ===================================================================================== -->
        <!-- Creat Wallet Button -->
        <!-- ===================================================================================== -->
        <div v-if="!isGeneratingKeystore" class="d-flex justify-center">
          <mew-button
            title="Back"
            btn-size="xlarge"
            btn-style="outline"
            class="mr-1"
            @click.native="backToOverview"
          />
          <mew-button
            class="CreateWalletKeystoreSubmitButton"
            title="Create Wallet"
            btn-size="xlarge"
            :has-full-width="false"
            :disabled="!enableCreateButton"
            @click.native="createWallet"
          />
        </div>

        <!-- ===================================================================================== -->
        <!-- Loading State: isGeneratingKeystore = true -->
        <!-- ===================================================================================== -->
        <v-row v-else justify="center" align="center" class="mt-1 mb-7">
          <v-progress-circular
            indeterminate
            color="greenPrimary"
          ></v-progress-circular>
          <p class="mb-0 mx-3">Sit tight while we are encrypting your wallet</p>
        </v-row>

        <!-- ===================================================================================== -->
        <!-- Warning Block -->
        <!-- ===================================================================================== -->
        <mew-warning-sheet
          class="mt-4 mb-0"
          title="NOT RECOMMENDED"
          description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. You will need your keystore file + password to access your wallet. Please save them in a secure location. We CAN NOT retrieve or reset your keystore/password if you lose them."
        />
      </template>

      <!-- ===================================================================================== -->
      <!-- Step 2: Download Keystore -->
      <!-- ===================================================================================== -->
      <template v-if="step === 2" #stepperContent2>
        <div class="subtitle-1 font-weight-bold grey--text step-two-header">
          STEP 2.
        </div>
        <div class="headline font-weight-bold">Download keystore file</div>
        <div class="mb-5">
          Important things to know before downloading your keystore file.
        </div>
        <v-row class="align-stretch">
          <v-col v-for="(d, key) in warningData" :key="key" cols="12" sm="4">
            <div class="pa-6 border-container">
              <div class="d-flex justify-center py-3">
                <mew-icon :icon-name="d.icon" :img-height="70" />
              </div>
              <h5 class="font-weight-bold mt-1 mb-2">{{ d.title }}</h5>
              <div>{{ d.description }}</div>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex flex-column flex-md-row justify-center mt-6">
          <mew-button
            title="Back"
            btn-style="outline"
            btn-size="xlarge"
            class="mx-md-1 my-1"
            @click.native="updateStep(1)"
          />
          <mew-button
            title="Acknowledge & Download"
            btn-size="xlarge"
            :has-full-width="false"
            class="mx-md-1 my-1 CreateWalletKeystoreAccept"
            @click.native="downloadWallet"
          />
        </div>
        <a
          ref="downloadLink"
          :href="walletFile"
          rel="noopener noreferrer"
          :download="name"
          class="link"
        />
        <mew-warning-sheet
          class="mt-4 mb-0"
          title="NOT RECOMMENDED"
          description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. You will need your keystore file + password to access your wallet. Please save them in a secure location. We CAN NOT retrieve or reset your keystore/password if you lose them."
        />
      </template>

      <!-- ===================================================================================== -->
      <!-- Step 3: Done -->
      <!-- ===================================================================================== -->
      <template v-if="step === 3" #stepperContent3>
        <div class="d-flex align-center">
          <div>
            <div
              class="subtitle-1 font-weight-bold grey--text step-three-header"
            >
              STEP 3.
            </div>
            <div class="headline font-weight-bold mb-3">You are done!</div>
            <p class="mb-6">
              You are now ready to take advantage of all that Ethereum has to
              offer! Access with keystore file should only be used in an offline
              setting.
            </p>
            <img
              class="done-image d-block d-sm-none mx-auto mt-12 mb-12"
              src="@/assets/images/icons/icon-keystore-mew.png"
            />

            <div class="d-flex justify-center flex-column">
              <mew-button
                title="Access Wallet"
                btn-size="xlarge"
                :has-full-width="false"
                class="mb-3 CreateWalletKeystoreAccess"
                @click.native="goToAccess"
              />
              <mew-button
                title="Create Another Wallet"
                :has-full-width="false"
                btn-style="transparent"
                @click.native="restart"
              />
            </div>
          </div>
          <img
            class="d-none d-sm-block ml-8 icon-keystore"
            src="@/assets/images/icons/icon-keystore-mew.png"
          />
        </div>
      </template>
    </mew-stepper>
  </white-sheet>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { isEmpty } from 'lodash';
import { useRouter } from 'vue-router/composables';

import { useAmplitude } from '@/core/composables/amplitude';
import handlerCreateWallet from '../handlers/handlerCreateWallet';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import { CREATE_WALLET } from '@/modules/analytics-opt-in/handlers/configs/events.js';

// injections/use
const { trackCreateWalletAmplitude } = useAmplitude();
const router = useRouter();

// data
const warningData = [
  {
    icon: 'paperPlane',
    title: "Don't lose it",
    description: 'Be careful, it can not be recovered if you lose it.'
  },
  {
    icon: 'thief',
    title: "Don't share it",
    description:
      'Your funds will be stolen if you use this file on a malicious phishing site.'
  },
  {
    icon: 'copy',
    title: 'Make a backup',
    description:
      'Secure it like the millions of dollars it may one day be worth.'
  }
];

const items = [
  {
    step: 1,
    name: 'STEP 1. Create password'
  },
  {
    step: 2,
    name: 'STEP 2. Download keystore file'
  },
  {
    step: 3,
    name: 'STEP 3. Well done'
  }
];
// reactive
const step = ref(1);
const password = ref('');
const cofirmPassword = ref('');
const walletFile = ref('');
const name = ref('');
const isGeneratingKeystore = ref(false);
const downloadLink = ref(null);
const walletCreateHandler = ref(null);

// computed
const errorPasswordConfirmation = computed(() => {
  if (
    password.value !== cofirmPassword.value &&
    cofirmPassword.value?.length > 0
  ) {
    return 'Passwords do not match';
  }
  return '';
});

const passwordMessages = computed(() => {
  if (isEmpty(password.value)) return 'Required';
  if (password.value?.length < 8) return 'Password is less than 8 characters';
  return '';
});

const enableCreateButton = computed(() => {
  return (
    !isEmpty(password.value) &&
    cofirmPassword.value === password.value &&
    password.value?.length >= 8
  );
});

// mounted
onMounted(() => {
  walletCreateHandler.value = new handlerCreateWallet();
});

// methods
const createWallet = () => {
  trackCreateWalletAmplitude(CREATE_WALLET.KEYSTORE_VERIFICATION);
  isGeneratingKeystore.value = true;
  walletCreateHandler.value
    .generateKeystore(password.value)
    .then(res => {
      name.value = res.name;
      walletFile.value = res.blobUrl;
      updateStep(2);
      isGeneratingKeystore.value = false;
      // Reset password value
      password.value = '';
      cofirmPassword.value = '';
    })
    .catch(e => {
      console.log(e);
      Toast(e, {}, ERROR);
    });
};

const downloadWallet = () => {
  downloadLink.value.click();
  trackCreateWalletAmplitude(CREATE_WALLET.KEYSTORE_DOWNLOAD);
  updateStep(3);
};

const goToAccess = () => {
  trackCreateWalletAmplitude(CREATE_WALLET.KEYSTORE_SUCCESS_ACCESS);
  router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
};

/**
 * Update step
 */
const updateStep = passedStepVal => {
  if (passedStepVal === 1) {
    trackCreateWalletAmplitude(CREATE_WALLET.KEYSTORE_BACK);
  }
  step.value = passedStepVal ? passedStepVal : 1;
};

const restart = () => {
  step.value = 1;
  password.value = '';
  cofirmPassword.value = '';
  trackCreateWalletAmplitude(CREATE_WALLET.KEYSTORE_SUCCESS_CREATE);
  router.push({
    name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_OVERVIEW.NAME
  });
};

const backToOverview = () => {
  trackCreateWalletAmplitude(CREATE_WALLET.KEYSTORE_BACK);
  router.push({
    name: ROUTES_HOME.CREATE_WALLET_SOFTWARE_OVERVIEW.NAME
  });
};
</script>

<style lang="scss" scoped>
.link {
  opacity: 0;
  position: absolute;
  top: 100000px;
  z-index: -1;
}
.mew-component--keystore .mew-stepper.v-stepper {
  background: transparent !important;
}
.border-container {
  border: 1px solid var(--v-greenPrimary-base);
  border-radius: 7px;
  box-shadow: 0 8px 15px var(--v-greyLight-base);
  height: 100%;
}
.done-image {
  max-width: 170px;
}
.icon-keystore {
  max-width: 250px;
}
</style>
