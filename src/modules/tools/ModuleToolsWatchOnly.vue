<template>
  <div>
    <v-dialog v-model="addDialog" max-width="500" width="100%">
      <v-card class="pa-4 pa-lg-8">
        <mew-address-select
          label="Address"
          :items="addresses"
        ></mew-address-select>
        <mew-input label="Address name" placeholder=" " />
        <mew-button
          title="Add"
          btn-size="xlarge"
          class="mt-1 mx-auto display--block"
        />
      </v-card>
    </v-dialog>

    <div class="d-block d-sm-flex justify-space-between mb-7">
      <app-block-title max-width="600px" no-page-title :data="title" />
      <mew-button
        icon-align="left"
        title="Add More"
        btn-style="transparent"
        icon="mdi-plus-circle"
        icon-type="mdi"
        btn-size="small"
        class="px-0"
        @click="addDialog = true"
      />
    </div>

    <tools-table-container />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import ToolsTableContainer from './components/ToolsTableContainer.vue';

// data
const addDialog = ref(false);
const addresses = [
  {
    address: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
    currency: 'ETH',
    nickname: 'My Address',
    resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
  },
  {
    address: '0x43689531907482BEE7e650D18411E284A7337A66',
    currency: 'ETH',
    nickname: 'nickname',
    resolverAddr: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
  }
];
const title = {
  title: 'Watch only address',
  description:
    'This is a recommended way to view your balance. You can only view your balance via this option.'
};
</script>
