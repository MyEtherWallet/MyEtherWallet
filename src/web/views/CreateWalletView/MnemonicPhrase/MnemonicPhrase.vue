<template>
  <div class="bg_blue">
    <v-sheet color="transparent" max-width="800px" class="mx-auto">
      <BlockTitle :data="titleData" />
      <SteppersHeaderContent :tabs="tabs" />
    </v-sheet>
    <div class="spacer-y-medium" />
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitle';
import SteppersHeaderContent from '@/components/Steppers/SteppersHeaderContent';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';

export default {
  name: 'MewConnect',
  components: { BlockTitle, SteppersHeaderContent },
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
    tabs: [
      { label: 'STEP 1. Write down the words', content: Step1 },
      { label: 'STEP 2. Verification', content: Step2 },
      { label: 'STEP 3. Well done', content: Step3 }
    ]
  })
};
</script>
