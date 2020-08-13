<template>
  <div>
    <mew-stepper :items="items" :on-step="2">
      <template v-slot:outsideStepContent0>
        111
      </template>
      <template v-slot:outsideStepContent0>
        222
      </template>
      <template v-slot:outsideStepContent0>
        333
      </template>
    </mew-stepper>
  </div>
</template>

<script>
export default {
  components: {},
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
    ]
  })
};
</script>

<style lang="scss" scoped></style>
