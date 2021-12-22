<template>
  <div class="py-13 px-15">
    <!-- Header titles -->
    <div class="d-flex align-center justify-start">
      <div>
        <div class="mew-heading-2">My Batch</div>
        <div class="mew-body textMedium--text">
          You have added {{ cart.length }} ETH Blocks for Minting. Please review
          and click "Proceed to Minting"
        </div>
      </div>
    </div>
    <v-row>
      <v-col cols="12" md="6" lg="6"> </v-col>
      <v-col cols="12" md="6" lg="6"> </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'ModuleEthBlockBatchMinting',
  computed: {
    ...mapState('ethBlocksTxs', ['cart'])
  }
};
</script>
