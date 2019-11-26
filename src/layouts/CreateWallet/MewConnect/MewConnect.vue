<template>
  <div class="light-blue darken-4">
    <div class="py-8" />
    <v-container>
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
              <v-tab-item v-for="i in 3" :key="i" :value="'tab-' + i">
                <v-card flat>
                  <v-card-text>{{ tab }}{{ text }}</v-card-text>
                </v-card>
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
    tab: 'tab-1',
    text:
      'An official, free companion App for MyEtherWallet that helps you secure your funds as never before.'
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
