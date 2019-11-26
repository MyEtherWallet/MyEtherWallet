<template>
  <div class="light-blue darken-4">
    <div class="py-8" />
    <v-container>
      <BlockTitle :data="titleData" class="mb-12" />
      <v-sheet max-width="800px" class="mx-auto">
        <v-stepper alt-labels>
          <v-stepper-header>
            <v-stepper-step step="1">Ad unit details</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step editable step="2">Ad sizes</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Ad templates</v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </v-sheet>
    </v-container>
    <div class="py-8" />
  </div>
</template>

<script>
import BlockTitle from '@/layouts/components/BlockTitle';

export default {
  name: 'MewConnect',
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: 'white--text',
      toptitle: '',
      title: 'MEWconnect',
      description:
        'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.',
      centered: true
    }
  })
};
</script>
