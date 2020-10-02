<template>
  <v-sheet color="transparent" max-width="800px" class="mx-auto">
    <mew-stepper-header :tabs="tabs" :active-tab="step" class="mb-6" />
    <div v-if="step === 1">
      <v-sheet color="white" class="border-radius--10px pa-4 pa-sm-12">
        <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
        <div class="headline font-weight-bold mb-5">Create password</div>

        <mew-input
          hint=""
          label="Password"
          placeholder="Password must be 8 or more charactors"
          class="mr-3 flex-grow-1"
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
            button-size="xlarge"
            :has-full-width="false"
            @click.native="step = 2"
          />
        </div>
      </v-sheet>
      <warning-sheet
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
                  <mew-icon :icon-name="d.icon" img-height="70" />
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
            button-size="xlarge"
            :has-full-width="false"
            @click.native="step = 3"
          />
        </div>
      </v-sheet>
      <warning-sheet
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
              button-size="xlarge"
              :has-full-width="false"
              class="mb-5"
              @click.native="step = 1"
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
import borderButton from '@/components/buttons/border-button/BorderButton.vue';
export default {
  name: 'MewConnect',
  components: { borderButton },
  props: {
    updateStep: {
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    step: 1,
    tabs: [
      {
        label: 'Create password'
      },
      {
        label: 'Download keystore file'
      },
      {
        label: 'Well done'
      }
    ],
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
    ]
  })
};
</script>
