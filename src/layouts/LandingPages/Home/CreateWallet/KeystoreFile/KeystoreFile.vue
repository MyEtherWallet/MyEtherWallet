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
        <div class="pt-6 pr-6 pl-6">
          <div
            class="step-progress-bar d-flex align-center text-center border-radius--5px overflow--hidden user-select--none"
          >
            <div
              :class="tab == 'tab-1' ? stepActive : stepDone"
              class="position--relative"
            >
              STEP 1. Download &amp; Install
              <img
                class="right-arrow"
                src="@/assets/images/icons/light/white/icon-right-arrow-white.svg"
              />
            </div>
            <div
              :class="[
                tab == 'tab-1' ? stepUndone : '',
                tab == 'tab-2' ? stepActive : '',
                tab == 'tab-3' ? stepDone : ''
              ]"
              class="position--relative"
            >
              STEP 2. Create a new wallet
              <img
                class="right-arrow"
                src="@/assets/images/icons/light/white/icon-right-arrow-white.svg"
              />
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
    <div class="py-3" />
  </div>
</template>

<script>
import BlockTitle from '../../../components/BlockTitle';
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
      title: 'Keystore file',
      titleMaxWidth: '',
      description:
        'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.',
      descriptionMaxWidth: '400px',
      centered: true
    },
    tab: 'tab-1'
  }),
  watch: {
    $route() {
      this.checkQueryStep();
    }
  },
  mounted() {
    this.checkQueryStep();
  },
  methods: {
    checkQueryStep() {
      const currentStep = this.$route.query.step;
      if (currentStep) {
        this.tab = 'tab-' + currentStep;
      } else {
        this.tab = 'tab-1';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.step-progress-bar {
  > div {
    width: 100%;
  }
}

.right-arrow {
  position: absolute;
  top: -36px;
  right: -8px;
  height: 117px;
  z-index: 1;
}
</style>
