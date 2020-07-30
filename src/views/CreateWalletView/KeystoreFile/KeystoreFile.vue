<template>
  <div class="bg_blue">
    <v-sheet color="transparent" max-width="800px" class="mx-auto">
      <BlockTitle :data="titleData" />
      <mew-stepper :items="items" :on-step="onStep">
        <template v-if="onStep === 1" v-slot:outsideStepContent1>
          <Step1 />
        </template>
        <template v-if="onStep === 2" v-slot:outsideStepContent2>
          <Step2 />
        </template>
        <template v-if="onStep === 3" v-slot:outsideStepContent3>
          <Step3 />
        </template>
      </mew-stepper>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/components/BlockTitle';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

export default {
  name: 'MewConnect',
  components: {
    BlockTitle,
    Step1,
    Step2,
    Step3
  },
  data: () => ({
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
    onStep: 1,
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Keystore file',
      titleMaxWidth: '',
      description:
        'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.',
      descriptionMaxWidth: '400px',
      centered: true
    }
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
        this.onStep = parseInt(currentStep);
      } else {
        this.onStep = 1;
      }
    }
  }
};
</script>
