<template>
  <div class="mt-5 mb-10">
    <v-row v-if="!showFee">
      <v-col cols="12" class="mb-n3">
        <v-card
          flat
          color="selectorBg lighten-1"
          class="d-flex align-center px-5 py-4"
          min-height="94px"
        >
          <v-card-text v-if="!gettingFee" class="text-center">
            Select provider to load transaction fee and enable Swap.
          </v-card-text>
          <v-card-text v-if="gettingFee">
            Loading transaction fee.
          </v-card-text>
          <v-skeleton-loader v-if="gettingFee" type="chip" width="100%" />
        </v-card>
      </v-col>
    </v-row>
    <slot v-else name="fee" />
  </div>
</template>

<script>
export default {
  name: 'SwapFee',
  props: {
    showFee: {
      type: Boolean,
      default: false
    },
    gettingFee: {
      type: Boolean,
      default: false
    }
  }
};
</script>
