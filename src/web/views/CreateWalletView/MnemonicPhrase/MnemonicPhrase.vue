<template>
  <div class="bg_blue">
    <v-sheet color="transparent" max-width="800px" class="mx-auto">
      <BlockTitle :data="titleData" />
      <mew-stepper :items="items" :on-step="1">
        <template v-slot:outsideStepContent0>
          <Step1 />
        </template>

        <template v-slot:outsideStepContent1>
          <Step2 />
        </template>

        <template v-slot:outsideStepContent2>
          <Step3 />
        </template>
      </mew-stepper>
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

export default {
  name: 'MewConnect',
  components: { BlockTitle, Step1, Step2, Step3 },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'Mnemonic phrase',
      titleMaxWidth: '',
      description:
        'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.',
      descriptionMaxWidth: '400px',
      centered: true
    },
    items: [
      {
        step: 1,
        name: 'STEP 1. Write down the words'
      },
      {
        step: 2,
        name: 'STEP 2. Verification'
      },
      {
        step: 3,
        name: 'STEP 3. Well done'
      }
    ]
  })
};
</script>
