<template>
  <div class="light-blue darken-4">
    <div class="py-8" />
    <v-container>
      <BlockTitle :data="titleData" class="mb-10" />
      <v-sheet
        max-width="800px"
        class="mx-auto border-radius--10px"
        color="white"
      >
        <div class="pa-6">
          <div
            class="step-progress-bar d-flex align-center text-center border-radius--5px overflow--hidden user-select--none"
          >
            <div :class="tab == 'tab-1' ? stepActive : stepDone">
              STEP 1. Download &amp; Install
            </div>
            <div
              :class="[
                tab == 'tab-1' ? stepUndone : '',
                tab == 'tab-2' ? stepActive : '',
                tab == 'tab-3' ? stepDone : ''
              ]"
            >
              STEP 2. Create a new wallet
            </div>
            <div :class="tab == 'tab-3' ? stepActive : stepUndone">
              STEP 3. Well done
            </div>
          </div>

          <div>
            <v-tabs-items v-model="tab">
              <v-tab-item :value="'tab-1'">
                <Step1 />
              </v-tab-item>
              <v-tab-item :value="'tab-2'">
                <Step2 />
              </v-tab-item>
              <v-tab-item :value="'tab-3'">
                <Step3 />
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </v-sheet>
    </v-container>
    <div class="py-12" />
    <div class="py-2" />
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

export default {
  name: 'MewConnect',
  components: { BlockTitle, Step1, Step2, Step3 },
  data: () => ({
    stepActive: 'light-blue darken-4 white--text pa-3 caption',
    stepDone: 'grey white--text pa-3 caption',
    stepUndone: 'grey lighten-3 grey--text text--lighten-1 pa-3 caption',
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
  > div {
    width: 100%;
  }
}
</style>
