<template>
  <div class="light-blue darken-4">
    <div class="py-8" />
    <v-container>
      <v-btn small @click="tab = 'tab-1'">1</v-btn>
      <v-btn small @click="tab = 'tab-2'">2</v-btn>
      <v-btn small @click="tab = 'tab-3'">3</v-btn>
      <BlockTitle :data="titleData" class="mb-10" />
      <v-sheet max-width="800px" class="mx-auto" color="white">
        <div class="pa-6">
          <div class="step-progress-bar d-flex align-center text-center">
            <div :class="stepItemClass">STEP 1. Download &amp; Install</div>
            <div :class="stepItemClass">STEP 2. Create a new wallet</div>
            <div :class="stepItemClass">STEP 3. Well done</div>
          </div>

          <div>
            <v-tabs-items v-model="tab">
              <v-tab-item :value="'tab-1'">
                <v-sheet class="d-flex align-end" min-height="350px">
                  <v-col cols="6">
                    <div class="subtitle-1 font-weight-bold grey--text">
                      STEP 1.
                    </div>
                    <div class="headline font-weight-bold mb-3">
                      Download &amp; Install
                    </div>
                    <div class="mb-6">
                      Please scan the QR Code, or search "MEWconnect" in Apple
                      App Store or Google Play Store. Continue if you have
                      already installed the App.
                    </div>
                    <StdButton buttonclass="button--green">Continue</StdButton>
                    <div class="mt-4">Already knew how to do it? Skip</div>
                  </v-col>
                  <v-col cols="6">
                    <v-img
                      class="mb-n9 mx-auto"
                      max-height="330px"
                      max-width="290px"
                      src="@/assets/images/Etc/CreateWallet/DownloadAndInstall.png"
                    />
                  </v-col>
                </v-sheet>
              </v-tab-item>
              <v-tab-item :value="'tab-2'">
                <v-sheet class="d-flex align-end" min-height="350px">
                  <v-col cols="6">
                    <div class="subtitle-1 font-weight-bold grey--text">
                      STEP 2.
                    </div>
                    <div class="headline font-weight-bold mb-3">
                      Download &amp; Install
                    </div>
                    <div class="mb-6">
                      Please follow the prompts in MEWconnect App and create a
                      new wallet. Continue if you have already created a new
                      wallet in the App.
                    </div>
                    <StdButton buttonclass="button--green">Continue</StdButton>
                    <div class="mt-4">Already knew how to do it? Skip</div>
                  </v-col>
                  <v-col cols="6">
                    <v-img
                      class="mb-n9 mx-auto"
                      max-height="330px"
                      max-width="290px"
                      src="@/assets/images/Etc/CreateWallet/DownloadAndInstall.png"
                    />
                  </v-col>
                </v-sheet>
              </v-tab-item>
              <v-tab-item :value="'tab-3'">
                <v-sheet class="d-flex align-end" min-height="350px">
                  <v-col cols="6">
                    <div class="subtitle-1 font-weight-bold grey--text">
                      STEP 3.
                    </div>
                    <div class="headline font-weight-bold mb-3">
                      Download &amp; Install
                    </div>
                    <div class="mb-6">
                      Congratulations! Please use the MEWconnect App to scan
                      this QR code in order to access your new wallet.
                    </div>
                    <StdButton buttonclass="button--green">Continue</StdButton>
                    <div class="mt-4">Already knew how to do it? Skip</div>
                  </v-col>
                  <v-col cols="6">
                    <v-img
                      class="mb-n9 mx-auto"
                      max-height="330px"
                      max-width="290px"
                      src="@/assets/images/Etc/CreateWallet/DownloadAndInstall.png"
                    />
                  </v-col>
                </v-sheet>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </v-sheet>
    </v-container>
    <div class="py-12" />
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';
import StdButton from '@/components/StdButton';

export default {
  name: 'MewConnect',
  components: { BlockTitle, StdButton },
  data: () => ({
    stepItemClass: 'light-blue darken-4 white--text pa-2 caption',
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'MEWconnect',
      description:
        'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.',
      centered: true
    },
    tab: 'tab-1'
  })
};
</script>

<style lang="scss" scoped>
.step-progress-bar {
  border-radius: 5px;
  overflow: hidden;
  > div {
    width: 100%;
  }
}
</style>
