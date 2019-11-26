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
              <v-tab-item :value="'tab-1'">1</v-tab-item>
              <v-tab-item :value="'tab-2'">2</v-tab-item>
              <v-tab-item :value="'tab-3'">3</v-tab-item>
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

export default {
  name: 'MewConnect',
  components: { BlockTitle },
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
