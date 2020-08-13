<template>
  <div>
    <block-title no-page-title :data="title" class="mb-7" />

    <mew-stepper :items="items" :on-step="1">
      <template v-slot:outsideStepContent1>
        <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
          111
        </v-sheet>
      </template>
      <template v-slot:outsideStepContent2>
        <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
          222
        </v-sheet>
      </template>
      <template v-slot:outsideStepContent3>
        <v-sheet color="transparent" max-width="600px" class="mx-auto py-10">
          <v-textarea outlined label="Signature" value="Value"></v-textarea>

          <mew-expand-panel
            is-toggle
            has-dividers
            :panel-items="exPannel1"
            class="mt-4 mb-10 swap-expend"
          >
            <template v-slot:panelBody1>
              1
            </template>
            <template v-slot:panelBody2>
              2
            </template>
          </mew-expand-panel>
        </v-sheet>
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import blockTitle from '@/components/block-title/BlockTitle';

export default {
  components: { blockTitle },
  data: () => ({
    title: {
      title: 'Send offline helper',
      description:
        'This is a recommended way to view your balance. You can only view your balance via this option.'
    },
    exPannel1: [
      {
        name: 'Raw transaction'
      },
      {
        name: 'Details'
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
    ]
  })
};
</script>

<style lang="scss" scoped></style>
