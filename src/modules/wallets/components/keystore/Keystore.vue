<template>
  <v-sheet color="transparent" max-width="800px" class="mx-auto">
    <mew-stepper :items="items" :on-step="step">
      <template v-if="step === 1" v-slot:outsideStepContent1>
        <div>
          <v-sheet color="white" class="border-radius--10px pa-12">
            <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
            <div class="headline font-weight-bold mb-5">Create password</div>
            <div class="d-flex align-start">
              <mew-input
                v-model="password"
                hint="Password must be 8 or more charactors"
                label="Password"
                placeholder="Password"
                class="mr-3 flex-grow-1"
                type="password"
              />
              <mew-button
                title="Create"
                btn-size="xlarge"
                :has-full-width="false"
                :disabled="password === '' || password.length < 7"
                @click.native="createWallet"
              />
            </div>
          </v-sheet>
          <warning-sheet
            title="NOT RECOMMENDED"
            description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
          />
        </div>
      </template>
      <template v-if="step === 2" v-slot:outsideStepContent2>
        <div>
          <v-sheet color="white" class="border-radius--10px pa-12">
            <div class="subtitle-1 font-weight-bold grey--text">STEP 2.</div>
            <div class="headline font-weight-bold mb-5">
              Download keystore file
            </div>
            <v-row class="align-stretch">
              <v-col v-for="(d, key) in warningData" :key="key">
                <mew-super-button
                  :title="d.title"
                  :subtitle="d.description"
                  is-column
                  icon-type="img"
                  :right-icon="d.img"
                />
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
          <warning-sheet
            title="NOT RECOMMENDED"
            description='This information is sensitive, and these options should only be used in offline settings by experienced crypto users. And MEW "CAN NOT" change your password. Please "DO NOT FORGET" to save your password, and it is your private key. You will need this "Password + Keystore file" to access your wallet.'
          />
        </div>
      </template>
      <template v-if="step === 3" v-slot:outsideStepContent3>
        <v-sheet color="white" class="border-radius--10px pa-12">
          <div class="d-flex align-center">
            <div class="mr-8">
              <div class="subtitle-1 font-weight-bold grey--text">STEP 3.</div>
              <div class="headline font-weight-bold mb-3">Well done!</div>
              <p class="mb-6">
                Congratulations! You have created a new wallet successfully.
              </p>
              <mew-button
                title="Access my wallet"
                btn-size="xlarge"
                :has-full-width="false"
                class="mb-5"
                @click.native="goToAccess"
              />
              <p class="mt-4 mb-0">
                <router-link
                  class="primary--text text-decoration--none font-weight-bold"
                  to="/"
                  >Back to Home page</router-link
                >
              </p>
            </div>
            <v-img
              max-width="250px"
              src="@/assets/images/icons/icon-keystore-mew.png"
            />
          </div>
        </v-sheet>
      </template>
    </mew-stepper>
    <div class="spacer-y-medium" />
  </v-sheet>
</template>

<script>
import Wallet from 'ethereumjs-wallet';
import { createBlob } from '@/modules/wallets/utils/helpers.js';
export default {
  name: 'CreateKeystore',
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
          title: "Don't lose it",
          description: "If you lose your file, we can't recover it for you.",
          img: 'paperPlane'
        },
        {
          title: "Don't share it",
          description:
            'This file gives permanent access to your wallet. Be careful where you use it.',
          img: 'thief'
        },
        {
          title: 'Make a Backup',
          description:
            'Secure it like the millions of dollars it may one day be worth.',
          img: 'copy'
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
          .catch(console.log);
      } catch (e) {
        console.log(e);
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
