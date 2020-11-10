<template>
  <v-sheet
    color="transparent"
    max-width="800px"
    class="mx-auto mew-component--keystore"
  >
    <mew-stepper
      :items="items"
      :on-step="step"
      class="mx-n12 mx-md-0"
    ></mew-stepper>

    <div v-if="step === 1">
      <v-sheet color="white" class="border-radius--10px pa-4 pa-sm-12">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
        <div class="headline font-weight-bold mb-5">Create password</div>

        <mew-input
          v-model="password"
          hint="Password must be 8 or more charactors"
          label="Password"
          placeholder="Password"
          class="mr-3 flex-grow-1"
          type="password"
        />
        <mew-input
          hint=""
          label="Confirm Password"
          placeholder="Confirm password"
          class="mr-3 flex-grow-1"
        />
        <div class="d-flex justify-center">
          <mew-button
            title="Create"
            btn-size="xlarge"
            :has-full-width="false"
            :disabled="password === '' || password.length < 7"
            @click.native="createWallet"
          />
        </div>
      </v-sheet>
      <mew-warning-sheet
        title="NOT RECOMMENDED"
        description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
      />
    </div>

    <div v-if="step === 2">
      <v-sheet color="white" class="border-radius--10px pa-4 pa-sm-12">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
        <div class="headline font-weight-bold">Download keystore file</div>
        <div class="mb-5">
          Important things to know before downloading your keystore file.
        </div>
        <v-row class="align-stretch">
          <v-col v-for="(d, key) in warningData" :key="key" cols="12" sm="4">
            <border-button>
              <div class="pa-6">
                <div class="d-flex justify-center py-3">
                  <mew-icon :icon-name="d.icon" :img-height="70" />
                </div>
                <h5 class="font-weight-bold mt-1 mb-2">{{ d.title }}</h5>
                <div>{{ d.description }}</div>
              </div>
            </border-button>
          </v-col>
        </v-row>
        <div class="d-flex justify-center mt-6">
          <mew-button
            title="Acknowledge & Download"
            btn-size="xlarge"
            :has-full-width="false"
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
      </v-sheet>
      <mew-warning-sheet
        title="NOT RECOMMENDED"
        description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
      />
    </div>

    <v-sheet
      v-if="step === 3"
      color="white"
      class="border-radius--10px pa-4 pa-sm-12"
    >
      <div class="d-flex align-center">
        <div>
          <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
          <div class="headline font-weight-bold mb-3">You are done!</div>
          <p class="mb-6">
            Congratulation! Please use the MEWconnect App to scan this QR code
            in order to access your new wallet. And you are done!
          </p>
          <v-img
            class="d-block d-sm-none mx-auto mt-12 mb-12"
            max-width="170px"
            src="@/assets/images/icons/icon-keystore-mew.png"
          />

          <div class="d-flex flex-column">
            <mew-button
              title="Access my wallet"
              btn-size="xlarge"
              class="mb-5"
              @click.native="goToAccess"
            />

            <div class="mt-3 mb-0 text-center">
              <router-link
                class="primary--text text-decoration--none font-weight-bold"
                to="/"
                >Back to home</router-link
              >
            </div>
          </div>
        </div>
        <v-img
          class="d-none d-sm-block ml-8"
          max-width="250px"
          src="@/assets/images/icons/icon-keystore-mew.png"
        />
      </div>
    </v-sheet>

    <div class="spacer-y-medium" />
  </v-sheet>
</template>

<script>
import { Toast, SENTRY, ERROR } from '@/components/toast';
import Wallet from 'ethereumjs-wallet';
import { createBlob } from '@/modules/wallets/utils/helpers.js';
import borderButton from '@/components/buttons/border-button/BorderButton.vue';

export default {
  name: 'CreateKeystore',
  components: {
    'border-button': borderButton
  },
  props: {
    step: {
      type: Number,
      default: 0
    },
    updateStep: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      warningData: [
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
      ],
      items: [
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
      ],
      password: '',
      walletFile: '',
      name: ''
    };
  },
  methods: {
    createWallet() {
      try {
        const wallet = Wallet.generate();
        wallet
          .toV3(this.password)
          .then(res => {
            this.walletFile = createBlob(res);
            this.name = wallet.getV3Filename();
            this.updateStep(2);
          })
          .catch(e => {
            Toast(e.message, {}, ERROR);
          });
      } catch (e) {
        Toast(e, {}, SENTRY);
      }
    },
    downloadWallet() {
      this.$refs.downloadLink.click();
      this.updateStep(3);
    },
    goToAccess() {
      this.$router.push({ name: 'AccessWallet' });
    }
  }
};
</script>

<style lang="scss" scoped>
.link {
  opacity: 0;
  position: absolute;
  top: 100000px;
  z-index: -1;
}
</style>

<style lang="scss">
.mew-component--keystore .mew-stepper.v-stepper {
  background: transparent !important;
}
</style>
